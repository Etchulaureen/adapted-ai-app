import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { AdaptationSchema } from './lib/schema.js';
import * as mockProvider from './lib/providers/mock.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json({ limit: '1mb' }));
// Absolute path: process.cwd() isn't guaranteed to be the project root inside a
// Vercel serverless function, unlike a locally-run `node server.js`.
app.use(express.static(path.join(__dirname, 'public')));

// AI_PROVIDER selects which provider adapts the text; all three implement the same
// adapt(sourceText) -> AdaptationSchema-shaped object contract (lib/schema.js), so switching
// providers is a one-line change here rather than a rewrite of server or client code.
// Defaults to 'mock' - a real provider needs credentials of its own before it should be default.
const PROVIDER_NAME = process.env.AI_PROVIDER || 'mock';

async function loadProvider(name) {
  if (name === 'mock') return mockProvider;
  if (name === 'anthropic') return import('./lib/providers/anthropic.js');
  if (name === 'gemini') return import('./lib/providers/gemini.js');
  throw new Error(`Unknown AI_PROVIDER "${name}". Use "mock", "anthropic", or "gemini".`);
}

app.post('/api/adapt', async (req, res) => {
  const sourceText = typeof req.body?.sourceText === 'string' ? req.body.sourceText.trim() : '';
  if (!sourceText) {
    return res.status(400).json({ error: 'sourceText is required.' });
  }

  try {
    const provider = await loadProvider(PROVIDER_NAME);
    const result = await provider.adapt(sourceText);

    const parsed = AdaptationSchema.safeParse(result);
    if (!parsed.success) {
      console.error('provider returned a response that failed schema validation:', parsed.error);
      return res.status(502).json({ error: 'The adaptation did not match the expected structure.' });
    }
    res.json(parsed.data);
  } catch (err) {
    console.error('adapt failed:', err);
    // Anthropic reports a bad key as a 401 AuthenticationError; Gemini's ApiError instead
    // reports it as a 400 whose message names the API key (confirmed against the real API -
    // it does not use a dedicated auth status code the way Anthropic does).
    const isAuthFailure =
      err?.name === 'AuthenticationError' ||
      err?.status === 401 ||
      (err?.status === 400 && /api key/i.test(err.message || ''));
    const status = isAuthFailure ? 401 : 502;
    res.status(status).json({ error: 'Adaptation failed.', detail: err.message });
  }
});

// Only bind a port when run directly (`node server.js`) - a Vercel serverless function instead
// imports the exported `app` (via api/index.js) and never reaches this branch.
const isMainModule = fileURLToPath(import.meta.url) === path.resolve(process.argv[1] || '');
if (isMainModule) {
  const port = process.env.PORT || 4318;
  app.listen(port, () => {
    console.log(`Prism running at http://127.0.0.1:${port} (AI_PROVIDER=${PROVIDER_NAME})`);
  });
}

export default app;
