import argparse
import json
import os
import sys
from pathlib import Path
from typing import List
import re

# Load environment variables from learnloop-s2v/.env if python-dotenv is available
try:
    from dotenv import load_dotenv  # type: ignore

    load_dotenv(dotenv_path=str(Path(__file__).resolve().parents[2] / ".env"))
except Exception:
    pass


def _require_env(key: str) -> str:
    value = os.getenv(key)
    if not value:
        raise RuntimeError(f"Missing required environment variable: {key}")
    return value


def _get_openai_client():
    # Lazy import to avoid hard dependency when not used
    try:
        from openai import OpenAI  # type: ignore
    except Exception as exc:  # pragma: no cover
        raise RuntimeError(
            "openai package not installed. Install with: pip install openai"
        ) from exc

    api_key = _require_env("OPENAI_API_KEY")
    return OpenAI(api_key=api_key)


def _call_openai_json(input_text: str, model: str) -> str:
    """
    Use v1 APIs only.
    1) Try Responses API
    2) Fallback to v1 Chat Completions
    """
    # Try v1 Responses
    try:
        client = _get_openai_client()
        r = client.responses.create(model=model, input=input_text)
        # Fast path
        if isinstance(getattr(r, "output_text", None), str) and r.output_text.strip():
            return r.output_text.strip()
        # Robust scrape: handle both 'output_text' and potential 'text' blocks
        chunks: List[str] = []
        for item in getattr(r, "output", []) or []:
            for c in getattr(item, "content", []) or []:
                t = getattr(c, "type", "")
                if t in ("output_text", "text"):
                    val = getattr(c, "text", None) or getattr(c, "value", None) or ""
                    if val:
                        chunks.append(val)
        if chunks:
            return "".join(chunks).strip()
    except Exception:
        pass  # fall through

    # Fallback to v1 Chat Completions (client.chat.completions)
    try:
        client = _get_openai_client()
        chat = client.chat.completions.create(
            model=model,
            temperature=0,
            messages=[
                {"role": "system", "content": "Return ONLY valid JSON as plain text. No Markdown."},
                {"role": "user", "content": input_text},
            ],
        )
        return chat.choices[0].message.content
    except Exception as exc:
        raise RuntimeError(f"OpenAI request failed: {exc}") from exc


UGC_SINGLE_SCRIPT_PROMPT_TEMPLATE = """
You are a UGC short-form SINGLE-SCRIPT generator for 30s - 60s, vertical (9:16) TikTok/Reels.
You ONLY output one JSON object with exactly three top-level keys: "topic", "characters", and "script".
Never include meta/brief/beats/on-screen text/alt hooks/hashtags/advice—scripts only.

SOURCE
- If 'source_text' is provided (e.g., PDF extract), prefer its facts/voice.
- If 'source_text' doesn’t support specifics, still write a maximally engaging script using generic, non-fabricated framing.

STYLE & HOOKS
- First 1.5s must be clear without sound. Lines ≤ 60 chars.
- Lean into engagement levers (pick 1–2 max per script):
- There can be multiple lines for a single video; make sure each stays under 500 characters.
- When something technical or science comes up, create narrative context before explaining it—the script must feel like a story.
- You are generating script for {count} video{plural}, so make every part hooky and bingeable.
- Every script must be in plain English. Do not label speakers (no "Character 1"), and avoid brackets—only spoken lines.
- For parts after the first, include spoken hooks such as "welcome to my series where ..." tailored to the topic.
- Spoken hooks only—never describe visual hooks.
Every script must rotate between these engagement levers (pick 1–2 per part):
  • Ragebait-lite (provocative but defensible take; invite comments)
  • Corny humor / obvious pun / playful cringe
  • Flirty/rom-com tease (PG-13 innuendo OK; no explicit)
  • Confessional opener (“I can’t believe this works…”)
  • Contrarian/unpopular opinion
  • Micro-mystery + reveal loop
  • Hyper-specific relatability (POV framing)
- Finish each part with the spoken call-to-action: "scroll for next part to know about the next topic."
Use real newlines (no "\\n" literals).

GUARDRAILS (concise)
- No fabricated facts or unverifiable claims from 'source_text'.
- Keep it PG-13: no explicit sexual content; no minors; no hate/harassment; no dangerous/illegal instructions.
- Character name must be a believable person.

OUTPUT FORMAT (STRICT) — return ONE JSON object and NOTHING else:

{{
  "topic": {{
    "video_topic": "short descriptive theme derived from source_text or a truthful generic theme",
    "topic_number": 1
  }},
  "characters": [
    {{
      "id": "charA",
      "name": "Creator",
      "voice_style": "derive from source_text if present; else 'natural, witty'"
    }}
  ],
  "script": {{
    "script no.": "1,2,3,...,{count}",
    "script 1": "",
    "...": "...",
    "script {count}": ""
  }}
}}

VALIDATION
- Output must be valid JSON (double quotes, no trailing commas).
- Only include the keys/fields shown above. Exactly one character. Exactly {count} scripts.
"""


def _build_generation_prompt(count: int) -> str:
    plural = "s" if count != 1 else ""
    return UGC_SINGLE_SCRIPT_PROMPT_TEMPLATE.format(count=count, plural=plural)


def generate_scripts(user_prompt: str, count: int = 10, model: str = "gpt-5") -> List[str]:
    if count <= 0:
        return []

    # Build a single input per Responses API style
    instructions = _build_generation_prompt(count)
    input_text = (
        f"{instructions}\n\n"
        "source_text (from user):\n"
        f"{user_prompt}\n\n"
        f"Return exactly {count} scripts inside the strict JSON schema above."
    )

    raw = _call_openai_json(input_text=input_text, model=model)

    if not raw:
        raise RuntimeError("Empty response from model")

    try:
        data = json.loads(raw)
        # Expect a top-level object with a "script" dict containing "script 1".."script 10"
        script_obj = data.get("script", {}) if isinstance(data, dict) else {}
        if not isinstance(script_obj, dict):
            raise ValueError("'script' is not an object")

        # Collect keys tolerant of 'script N' or 'scriptN'
        numbered = []
        for key, value in script_obj.items():
            m = re.match(r"^script\s*([0-9]+)$", str(key).strip(), re.IGNORECASE)
            if m:
                try:
                    num = int(m.group(1))
                except Exception:
                    continue
                numbered.append((num, str(value).strip()))

        numbered.sort(key=lambda x: x[0])
        result = [text for _, text in numbered if text]
    except Exception:
        # If JSON parsing fails, attempt to split into multiple scripts by blank lines
        chunks = [chunk.strip() for chunk in raw.split("\n\n") if chunk.strip()]
        result = chunks[:count]

    # Ensure we return exactly `count` items by truncating or padding
    if len(result) > count:
        result = result[:count]
    elif len(result) < count:
        # Pad with empty placeholders to maintain count, caller may filter
        result = result + [""] * (count - len(result))

    return result


def generate_series(user_prompt: str, count: int = 10, model: str = "gpt-5") -> dict:
    """Generate topic metadata and a list of scripts.

    Returns a dict: {"topic": video_topic: str, "scripts": List[str]}
    """
    # Build single input text once
    instructions = _build_generation_prompt(count)
    input_text = (
        f"{instructions}\n\n"
        "source_text (from user):\n"
        f"{user_prompt}\n\n"
        f"Return exactly {count} scripts inside the strict JSON schema above."
    )

    raw = _call_openai_json(input_text=input_text, model=model)

    if not raw:
        raise RuntimeError("Empty response from model")

    topic = ""
    scripts: List[str] = []
    try:
        data = json.loads(raw)
        topic_obj = data.get("topic", {}) if isinstance(data, dict) else {}
        if isinstance(topic_obj, dict):
            topic_val = topic_obj.get("video_topic")
            if isinstance(topic_val, str):
                topic = topic_val.strip()

        script_obj = data.get("script", {}) if isinstance(data, dict) else {}
        if isinstance(script_obj, dict):
            numbered = []
            for key, value in script_obj.items():
                m = re.match(r"^script\s*([0-9]+)$", str(key).strip(), re.IGNORECASE)
                if m:
                    try:
                        num = int(m.group(1))
                    except Exception:
                        continue
                    numbered.append((num, str(value).strip()))
            numbered.sort(key=lambda x: x[0])
            scripts = [text for _, text in numbered if text]
    except Exception:
        # Fallback minimal behavior if JSON parsing fails
        chunks = [chunk.strip() for chunk in raw.split("\n\n") if chunk.strip()]
        scripts = chunks[:count]

    # Normalize count
    if len(scripts) > count:
        scripts = scripts[:count]
    elif len(scripts) < count:
        scripts = scripts + [""] * (count - len(scripts))

    return {"topic": topic, "scripts": scripts}


def _parse_args(argv: List[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Generate N educational avatar scripts from a prompt using OpenAI",
    )
    parser.add_argument(
        "--prompt",
        type=str,
        default=None,
        help="User prompt describing the lesson/topic",
    )
    parser.add_argument(
        "--count",
        type=int,
        default=10,
        help="Number of scripts to generate (default: 10)",
    )
    parser.add_argument(
        "--model",
        type=str,
        default="gpt-5",
        help="OpenAI model name (default: gpt-5)",
    )
    return parser.parse_args(argv)


def main(argv: List[str]) -> int:
    args = _parse_args(argv)

    prompt = args.prompt
    if not prompt:
        try:
            prompt = input("Enter prompt: ").strip()
        except EOFError:
            prompt = ""

    if not prompt:
        print("Error: prompt is required", file=sys.stderr)
        return 2

    try:
        scripts = generate_scripts(user_prompt=prompt, count=args.count, model=args.model)
    except Exception as exc:
        print(f"Generation failed: {exc}", file=sys.stderr)
        return 1

    # Print scripts separated for readability
    for idx, script in enumerate(scripts, start=1):
        print(f"===== Script {idx} / {len(scripts)} =====")
        print(script)
        if idx < len(scripts):
            print()

    return 0


if __name__ == "__main__":  # pragma: no cover
    raise SystemExit(main(sys.argv[1:]))

