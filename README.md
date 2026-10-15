# Prism

**The same knowledge. A different path to understanding.**

Prism is an accessibility layer for educational content. Paste a passage (or ask a question) and
choose how it's presented: **Readable**, **Focused**, **Visual**, or **Compare**. A Fidelity Check
confirms that no concept was dropped or invented along the way, and a 3-question quiz checks
understanding against the original source.

Live: https://adapted-ai-app.vercel.app/

## Run locally

Requires Node 20.6+.

```bash
npm install
cp .env.example .env   # then fill in a key if you want a real model
npm run dev            # http://127.0.0.1:4318
```

`AI_PROVIDER` in `.env` picks the engine:

| Value       | Needs                 | Notes                                       |
|-------------|-----------------------|---------------------------------------------|
| `mock`      | nothing               | Default; deterministic sample output        |
| `anthropic` | `ANTHROPIC_API_KEY`   | Claude via structured outputs               |
| `gemini`    | `GEMINI_API_KEY`      | Gemini via JSON schema output               |

## Project layout

```
server.js               Express app: serves public/ and POST /api/adapt
api/index.js            Vercel serverless entry (re-exports server.js)
lib/schema.js           The AI response contract (zod) every provider must match
lib/prompt.js           System prompt / adaptation guardrails
lib/providers/          mock, anthropic, gemini implementations
public/                 Frontend (index.html, app.js, styles.css)
```

## Deploy

Hosted on Vercel. API keys are set as Environment Variables in the Vercel project settings,
never committed to this repo.
