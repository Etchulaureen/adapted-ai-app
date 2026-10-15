import { z } from 'zod/v4';

// Prism's AI Response Schema (originally specified as the AdaptEd AI PRD, Section 06).
// Shared by every provider (mock or real) so a swap can never drift from the contract
// the frontend (public/app.js) renders against.
export const AdaptationSchema = z.object({
  // The text every mode and the Fidelity Check are measured against: the learner's own passage
  // when they pasted one, or the explanation the model composed when they only asked a question.
  // Optional so older saved sessions and any provider that omits it still validate; the frontend
  // falls back to the raw input the learner typed.
  source_text: z.string().optional(),

  essential_concepts: z.array(z.string()),

  readable: z.object({
    sections: z.array(
      z.object({
        heading: z.string(),
        body: z.string(),
        key_terms: z.array(z.string()),
      }),
    ),
  }),

  focused: z.object({
    stages: z.array(
      z.object({
        step: z.number().int(),
        title: z.string(),
        body: z.string(),
      }),
    ),
    key_takeaway: z.string(),
  }),

  visual: z.object({
    structure_type: z.enum(['sequence', 'relational', 'non_spatial']),
    type: z.enum(['flow', 'concept_map', 'cards']),
    nodes: z.array(z.object({ id: z.string(), label: z.string() })),
    edges: z.array(
      z.object({
        from: z.string(),
        to: z.string(),
        label: z.string().optional(),
        directional: z.boolean(),
      }),
    ),
  }),

  fidelity: z.object({
    preserved: z.array(z.string()),
    pedagogical_aids: z.array(
      z.object({
        type: z.enum(['analogy', 'example', 'metaphor']),
        text: z.string(),
      }),
    ),
    unsupported_additions: z.array(z.string()),
  }),

  // Fixed 3-question rubric: recall, relationship, application (PRD Section 06).
  quiz: z
    .array(
      z.object({
        question: z.string(),
        choices: z.array(z.string()).length(4),
        answer_index: z.number().int().min(0).max(3),
        concept_id: z.string(),
        bloom_level: z.enum(['recall', 'relationship', 'application']),
      }),
    )
    .length(3),
});
