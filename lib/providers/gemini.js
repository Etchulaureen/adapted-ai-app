import { GoogleGenAI } from '@google/genai';
import { z } from 'zod/v4';
import { AdaptationSchema } from '../schema.js';
import { SYSTEM_PROMPT } from '../prompt.js';

const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Reuse the same zod v4 schema the Anthropic provider derives its structured-output format
// from (lib/schema.js), instead of hand-writing a duplicate JSON schema that could drift.
const responseJsonSchema = z.toJSONSchema(AdaptationSchema);
delete responseJsonSchema.$schema; // Gemini's schema field doesn't expect this JSON-Schema-meta key

/**
 * Calls Gemini to produce a structured adaptation. Throws on any failure -
 * the caller (server.js) is responsible for turning that into an HTTP response.
 *
 * NOTE: unlike the Anthropic provider, @google/genai has no client-side schema-parsing
 * helper, so the response is parsed and re-validated against AdaptationSchema here directly
 * (server.js validates again regardless, as a second line of defense for every provider).
 */
export async function adapt(sourceText) {
  const response = await client.models.generateContent({
    // Pinned, not the `gemini-flash-latest` alias: that alias currently 503s specifically for
    // this app's large structured-output schema (confirmed via direct testing - small schemas
    // work fine on it, so it's a capacity limit on the aliased model, not a schema bug). Revisit
    // this pin if Google deprecates it the way gemini-2.5-flash was deprecated mid-project.
    model: 'gemini-3.5-flash',
    contents: sourceText,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: 'application/json',
      // responseJsonSchema (not responseSchema) accepts standard JSON Schema - confirmed
      // against @google/genai's own type definitions, which document responseSchema as the
      // older, stricter OpenAPI-3.0-subset dialect and responseJsonSchema as the JSON Schema
      // one z.toJSONSchema() produces.
      responseJsonSchema: responseJsonSchema,
    },
  });

  let parsedJson;
  try {
    parsedJson = JSON.parse(response.text);
  } catch {
    throw new Error('Could not parse a structured adaptation from the model.');
  }

  const parsed = AdaptationSchema.safeParse(parsedJson);
  if (!parsed.success) {
    throw new Error('Gemini response did not match the expected structure.');
  }
  return parsed.data;
}
