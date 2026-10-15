// The curated, benchmark-quality response for the exact sample lesson (PRD Section 03/04),
// so the sample-lesson demo path always looks like a finished product, mock mode or real.
export const SAMPLE_TEXT = `Photosynthesis converts light energy into chemical energy in photoautotrophic organisms. It occurs mainly in chloroplasts, where chlorophyll absorbs light. Carbon dioxide and water are transformed into glucose and oxygen is released. Light-dependent reactions in thylakoid membranes produce ATP and NADPH; the Calvin cycle in the stroma uses them for carbon fixation and synthesis of organic molecules.`;

export const SAMPLE_RESPONSE = {
  source_text: SAMPLE_TEXT,
  essential_concepts: [
    'photosynthesis',
    'light to chemical energy',
    'chloroplast',
    'chlorophyll',
    'carbon dioxide + water',
    'glucose + oxygen',
    'thylakoid membranes',
    'ATP/NADPH',
    'Calvin cycle',
    'stroma',
    'carbon fixation',
  ],
  readable: {
    sections: [
      {
        heading: 'What it does',
        body: 'Photosynthesis converts light energy into chemical energy, inside chloroplasts where chlorophyll absorbs the light.',
        key_terms: ['chloroplast', 'chlorophyll'],
      },
      {
        heading: 'Inputs and outputs',
        body: 'Carbon dioxide and water go in; glucose and oxygen come out.',
        key_terms: ['carbon dioxide', 'water', 'glucose', 'oxygen'],
      },
      {
        heading: 'Two linked stages',
        body: 'Light reactions in the thylakoid membranes make ATP and NADPH; the Calvin cycle in the stroma uses them for carbon fixation and to build organic molecules.',
        key_terms: ['thylakoid membranes', 'ATP', 'NADPH', 'Calvin cycle', 'stroma', 'carbon fixation'],
      },
    ],
  },
  focused: {
    stages: [
      { step: 1, title: 'Where it happens', body: 'Inside the chloroplast, where chlorophyll absorbs light.' },
      { step: 2, title: 'What goes in, what comes out', body: 'Carbon dioxide and water become glucose, releasing oxygen.' },
      { step: 3, title: 'Light-dependent reactions', body: 'In the thylakoid membranes, light drives reactions that produce ATP and NADPH - the energy carriers the next stage runs on.' },
      { step: 4, title: 'The Calvin cycle', body: 'In the stroma, ATP and NADPH power carbon fixation, building the organic molecules the cell needs.' },
    ],
    key_takeaway: 'Photosynthesis is one process in two linked stages: light reactions capture energy, and the Calvin cycle uses it to build sugar.',
  },
  visual: {
    structure_type: 'sequence',
    type: 'flow',
    nodes: [
      { id: 'light', label: 'Light' },
      { id: 'chloroplast', label: 'Chlorophyll / Chloroplast' },
      { id: 'light_rxn', label: 'Light reactions' },
      { id: 'atp_nadph', label: 'ATP / NADPH' },
      { id: 'calvin', label: 'Calvin cycle' },
      { id: 'organics', label: 'Organic molecules' },
    ],
    edges: [
      { from: 'light', to: 'chloroplast', directional: true },
      { from: 'chloroplast', to: 'light_rxn', directional: true },
      { from: 'light_rxn', to: 'atp_nadph', directional: true },
      { from: 'atp_nadph', to: 'calvin', directional: true },
      { from: 'calvin', to: 'organics', directional: true },
    ],
  },
  fidelity: {
    preserved: [
      'photosynthesis', 'light to chemical energy', 'chloroplast', 'chlorophyll',
      'carbon dioxide + water', 'glucose + oxygen', 'thylakoid membranes', 'ATP/NADPH',
      'Calvin cycle', 'stroma',
    ],
    pedagogical_aids: [
      { type: 'analogy', text: 'ATP and NADPH act like a rechargeable battery, carrying energy from the light reactions over to the Calvin cycle.' },
    ],
    unsupported_additions: [],
  },
  quiz: [
    {
      question: 'Where in the plant cell does photosynthesis mainly take place?',
      choices: ['The nucleus', 'The chloroplast', 'The mitochondrion', 'The cell wall'],
      answer_index: 1,
      concept_id: 'chloroplast',
      bloom_level: 'recall',
    },
    {
      question: 'What does the light-dependent reaction supply to the Calvin cycle?',
      choices: ['Carbon dioxide and water', 'ATP and NADPH', 'Glucose and oxygen', 'Chlorophyll'],
      answer_index: 1,
      concept_id: 'atp_nadph',
      bloom_level: 'relationship',
    },
    {
      question: 'What happens to carbon dioxide and water during photosynthesis?',
      choices: [
        'They are released as waste',
        'They are converted into glucose and oxygen',
        'They power the thylakoid membranes directly',
        'They are stored in the stroma unchanged',
      ],
      answer_index: 1,
      concept_id: 'carbon_fixation',
      bloom_level: 'application',
    },
  ],
};
