# Project Update Log

- Last updated: 2025-10-17 12:10 UTC
- Next scheduled review: within 10 minutes of the last update (or sooner if requested)

## Codebase Overview
- `client/` contains a Vite + React single-page app scaffolded from the default template.
- `client/src/main.jsx` bootstraps the React app with `StrictMode` and renders `App`.
- `client/src/App.jsx` displays Vite/React logos and a counter button backed by `useState`.
- Styling resides in `client/src/App.css` and `client/src/index.css`; assets live under `client/public/` and `client/src/assets/`.
- Tooling includes Vite for bundling, ESLint with React hooks/refresh plugins, and npm scripts for dev/build/lint/preview.

## Dependencies
- Runtime: `react@^19.1.1`, `react-dom@^19.1.1`.
- Dev: `vite@^7.1.7`, `@vitejs/plugin-react`, ESLint ecosystem (`@eslint/js`, `eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `globals`), and TypeScript type packages for React/DOM.

## Known Bugs
- None observed in the current baseline template; the counter demo runs locally when dependencies are installed with `npm install` and the dev server started via `npm run dev`.

## Recent Notes
- Initial log entry created after reviewing every file in the repository. Future updates should capture code changes, discovered bugs, and their resolutions as they occur.

## Runtime & Stack (learnloop-s2v)
- Language / Runtime: Python 3.11+
- CLI & Orchestration: argparse (single CLI entrypoint)
- API (optional): FastAPI + Uvicorn (sync endpoints that call the same stage code)
- HTTP client (to FAL/Argil): fal-client (preferred), requests
- Config: PyYAML (reads configs/*.yaml), os.environ for FAL_KEY (+ optional python-dotenv)
- Persistence: Local filesystem only (runs/ folders); no DB
- Video post (optional): ffmpeg via subprocess (only if you add polish later)
- Data models (API): Pydantic (FastAPI’s request/response schemas)
- Logging: Python logging + newline-delimited JSON logs (log.jsonl)
- Quality (optional): pytest (tests), ruff + black (lint/format), mypy (typing)

## Update Protocol
- Refresh this document every 10 minutes or whenever a user explicitly requests an update. Each refresh should note new changes, outstanding issues, and resolved items.
