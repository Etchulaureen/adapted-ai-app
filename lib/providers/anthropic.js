import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { AdaptationSchema } from '../schema.js';
import { SYSTEM_PROMPT } from '../prompt.js';

const client = new Anthropic(); // resolves ANTHROPIC_API_KEY from the environment

/**
 * Calls Claude to produce a structured adaptation. Throws on any failure -
 * the caller (server.js) is responsible for turning that into an HTTP response.
 */
export async function adapt(sourceText) {
  const response = await client.messages.parse({
    model: 'claude-opus-5-5',
    max_tokens: 8000,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: sourceText }],
    output_config: { format: zodOutputFormat(AdaptationSchema) },
  });

  if (!response.parsed_output) {
    throw new Error('Could not parse a structured adaptation from the model.');
  }
  return response.parsed_output;
}
