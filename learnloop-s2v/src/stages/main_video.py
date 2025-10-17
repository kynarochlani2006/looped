"""
End-to-end driver for generating scripts and calling FAL to produce avatar videos.

Flow:
1) Load `.env` for keys
2) Optionally skip OpenAI and send a single script directly to FAL (`--direct-to-fal`)
3) Otherwise: generate a series (topic + N scripts) via OpenAI
4) Save scripts to a timestamped folder; optionally submit each to FAL
5) Download resulting videos to the same folder
"""

import argparse
import json
import os
import sys
import time
from pathlib import Path
from typing import List

# Attempt to load environment variables from repo root `.env`.
# Load environment variables from learnloop-s2v/.env if python-dotenv is available
try:
    from dotenv import load_dotenv  # type: ignore

    load_dotenv(dotenv_path=str(Path(__file__).resolve().parents[2] / ".env"))
except Exception:
    pass

import requests

# Support both package and script execution
try:
    from .gen_script import generate_series  # type: ignore
    from ..utils import fal as fal_wrap  # type: ignore
except Exception:
    # Fallback when run directly: add src/ to sys.path
    _SRC_DIR = Path(__file__).resolve().parents[1]
    if str(_SRC_DIR) not in sys.path:
        sys.path.insert(0, str(_SRC_DIR))
    from gen_script import generate_series  # type: ignore
    from utils import fal as fal_wrap  # type: ignore


def _slugify(value: str) -> str:
    """Convert arbitrary text to a filesystem-friendly slug.

    Replaces non-alphanumeric characters with hyphens and collapses repeats.
    Returns "untitled" if the input becomes empty after normalization.
    """
    slug = "".join(ch.lower() if ch.isalnum() else "-" for ch in value).strip("-")
    while "--" in slug:
        slug = slug.replace("--", "-")
    return slug or "untitled"


def _timestamp_folder(base_dir: Path) -> Path:
    """Create and return a folder with a timestamp name inside base_dir.

    Format: EP_YYYYMMDD_HHMMSS
    """
    ts = time.strftime("EP_%Y%m%d_%H%M%S")
    out = base_dir / ts
    out.mkdir(parents=True, exist_ok=True)
    return out


def _download(url: str, dest: Path) -> None:
    """Download a large file in streaming chunks with error propagation.

    Args:
        url: HTTP(S) URL to download from.
        dest: Local file path to write to (parent dirs must exist).
    """
    with requests.get(url, stream=True, timeout=300) as r:
        r.raise_for_status()
        with open(dest, "wb") as f:
            for chunk in r.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)


def _parse_args(argv: List[str]) -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Generate scripts and videos via FAL")
    p.add_argument("--prompt", type=str, default=None, help="User/source text for scripts")
    p.add_argument("--avatar", type=str, default="Noemie car (UGC)")
    p.add_argument("--voice", type=str, default="Rachel")
    p.add_argument("--remove-background", action="store_true")
    p.add_argument("--model", type=str, default="gpt-5")
    p.add_argument("--count", type=int, default=10)
    p.add_argument("--out-dir", type=str, default="runs")
    p.add_argument(
        "--direct-to-fal",
        action="store_true",
        help="Bypass OpenAI generation and send the prompt directly to FAL (single video)",
    )
    p.add_argument(
        "--fal-model",
        type=str,
        default="argil/avatars/text-to-video",
        help="FAL model route",
    )
    return p.parse_args(argv)


def main(argv: List[str]) -> int:
    """CLI entry point orchestrating OpenAI generation and FAL submissions.

    Returns:
        0 on success, non-zero on error or user-aborted flows.
    """
    args = _parse_args(argv)

    out_root = Path(args.out_dir)

    prompt = args.prompt
    if not prompt:
        try:
            prompt = input("Enter prompt: ").strip()
        except EOFError:
            prompt = ""
    if not prompt:
        print("Error: prompt is required", file=sys.stderr)
        return 2

    # Direct-to-FAL testing path (no OpenAI)
    if args.direct_to_fal:
        topic_slug = _slugify("testing 101")
        out_dir = out_root / f"{time.strftime('EP_%Y%m%d_%H%M%S')}_{topic_slug}"
        out_dir.mkdir(parents=True, exist_ok=True)

        payload = {
            "avatar": args.avatar,
            "text": prompt,
            "voice": args.voice,
        }
        if args.remove_background:
            payload["remove_background"] = True

        # Save payload
        with open(out_dir / "payload_1.json", "w", encoding="utf-8") as f:
            json.dump(payload, f, ensure_ascii=False, indent=2)

        # Submit using fal_client wrapper and wait with logs
        def _on_update(update):
            try:
                logs = getattr(update, "logs", None) or []
                for log in logs:
                    msg = log.get("message") if isinstance(log, dict) else None
                    if msg:
                        print(msg)
            except Exception:
                pass

        result = fal_wrap.subscribe(
            args.fal_model,
            arguments=payload,
            with_logs=True,
            on_queue_update=_on_update,
        )

        data = result.get("data") if isinstance(result, dict) else None
        if not data:
            data = result
        video = (data or {}).get("video") or {}
        video_url = video.get("url")
        if not video_url:
            print(f"No video URL in result: {result}", file=sys.stderr)
            return 1

        dest = out_dir / f"{topic_slug}.mp4"
        try:
            _download(video_url, dest)
        except Exception as exc:
            print(f"Download failed: {exc}", file=sys.stderr)
            return 1

        print(f"Test video saved to: {dest}")
        return 0

    series = generate_series(user_prompt=prompt, count=args.count, model=args.model)
    topic = series.get("topic") or ""
    scripts = [s for s in (series.get("scripts") or []) if s]
    if not scripts:
        print("No scripts generated", file=sys.stderr)
        return 1

    topic_slug = _slugify(topic)
    # Folder name combines timestamp and topic slug for uniqueness and readability
    out_dir = out_root / f"{time.strftime('EP_%Y%m%d_%H%M%S')}_{topic_slug}"
    out_dir.mkdir(parents=True, exist_ok=True)

    # Save all scripts in a single text file
    script_txt = out_dir / "script.txt"
    with open(script_txt, "w", encoding="utf-8") as f:
        for idx, s in enumerate(scripts, 1):
            f.write(f"[Script {idx}]\n{s}\n\n")

    # Inform user and ask to proceed to FAL submissions
    print(f"Scripts generated and saved to: {script_txt}")
    try:
        proceed = input("Continue to generate videos with FAL now? [y/N]: ").strip().lower()
    except EOFError:
        proceed = "n"
    if proceed not in {"y", "yes"}:
        print("Okay, stopping after script generation.")
        print(f"You can resume later by running this command again and confirming.")
        return 0

    # Ask user how many scripts to send to FAL
    max_count = len(scripts)
    to_send = max_count
    try:
        raw = input(f"How many scripts to send to FAL? [1-{max_count}, default {max_count}]: ").strip()
        if raw:
            try:
                value = int(raw)
                if value < 1:
                    value = 1
                if value > max_count:
                    value = max_count
                to_send = value
            except Exception:
                pass
    except EOFError:
        pass

    try:
        confirm = input(f"Confirm sending {to_send} script(s) to FAL? [y/N]: ").strip().lower()
    except EOFError:
        confirm = "n"
    if confirm not in {"y", "yes"}:
        print("Submission aborted by user.")
        return 0

    def _on_update(update):
        try:
            # fal_client.InProgress exposes logs as list of dicts
            logs = getattr(update, "logs", None) or []
            for log in logs:
                msg = log.get("message") if isinstance(log, dict) else None
                if msg:
                    print(msg)
        except Exception:
            pass

    for idx, s in enumerate(scripts[:to_send], 1):
        payload = {
            "avatar": args.avatar,
            "text": s,
            "voice": args.voice,
        }
        if args.remove_background:
            payload["remove_background"] = True

        # Save payload
        with open(out_dir / f"payload_{idx}.json", "w", encoding="utf-8") as f:
            json.dump(payload, f, ensure_ascii=False, indent=2)

        # Submit to FAL using fal_client and wait synchronously with logs
        result = fal_wrap.subscribe(
            args.fal_model,
            arguments=payload,
            with_logs=True,
            on_queue_update=_on_update,
        )

        # Expecting result like {"data": {"video": {"url": ...}}} or {"video": {"url": ...}}
        data = result.get("data") if isinstance(result, dict) else None
        if not data:
            data = result
        video = (data or {}).get("video") or {}
        video_url = video.get("url")
        if not video_url:
            print(f"No video URL in result for script {idx}: {result}", file=sys.stderr)
            continue

        dest = out_dir / f"{topic_slug}_part-{idx}.mp4"
        try:
            _download(video_url, dest)
        except Exception as exc:
            print(f"Download failed for script {idx}: {exc}", file=sys.stderr)

    print(f"Outputs saved to: {out_dir}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))


