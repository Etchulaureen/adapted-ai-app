import { SAMPLE_TEXT, SAMPLE_RESPONSE } from './sample-response.js';

// No network call, no API key: this provider only reformats and extracts from the text it is
// given, so - unlike a real model - it structurally cannot invent a fact or drop a concept. Good
// enough to build and demo the whole flow against; swap in lib/providers/anthropic.js (or another
// provider you write to the same shape) for real adaptation quality.

const STOPWORDS = new Set([
  'about', 'after', 'again', 'because', 'before', 'being', 'between', 'could', 'doing',
  'during', 'having', 'other', 'should', 'their', 'there', 'these', 'those', 'through',
  'while', 'which', 'would', 'within', 'without', 'across', 'around', 'among', 'where',
  'these', 'those', 'first', 'second', 'third', 'fourth', 'often', 'mainly', 'occurs',
]);

function splitSentences(text) {
  const found = text.match(/[^.!?]+[.!?]+/g);
  const sentences = (found && found.length ? found : [text]).map((s) => s.trim()).filter(Boolean);
  return sentences.length ? sentences : [text.trim() || 'No content provided.'];
}

function slug(word) {
  return word.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || 'concept';
}

function titleCase(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function extractConcepts(text, max = 8) {
  const words = text.match(/[A-Za-z][A-Za-z'-]{4,}/g) || [];
  const freq = new Map();
  const firstIndex = new Map();
  words.forEach((w, i) => {
    const lw = w.toLowerCase();
    if (STOPWORDS.has(lw)) return;
    freq.set(lw, (freq.get(lw) || 0) + 1);
    if (!firstIndex.has(lw)) firstIndex.set(lw, i);
  });
  const ranked = [...freq.entries()].sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    return firstIndex.get(a[0]) - firstIndex.get(b[0]);
  });
  let concepts = ranked.slice(0, max).map(([w]) => w);
  // Pad with generic placeholders if the source is too short/sparse to yield enough concepts -
  // keeps the schema satisfiable (quiz needs at least 4 distinct concepts) for very short input.
  let i = 1;
  while (concepts.length < 4) {
    concepts.push(`concept ${i}`);
    i++;
  }
  return concepts;
}

function chunk(arr, groups) {
  const size = Math.max(1, Math.ceil(arr.length / groups));
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out.slice(0, groups);
}

// A short question/word ("What is a habitat?") has no existing passage to reformat - answering
// it means composing new knowledge, which only a real provider can do honestly. Rather than
// padding out fake "Concept 1/2/3" filler and pretending it means something, mock mode says so
// plainly. This is what "structurally cannot invent a fact" (see the file header) looks like when
// there's nothing to extract from.
function thinInputNotice(sourceText, realConceptCount) {
  const notice =
    `Mock mode can only reformat text you already provide - it has no way to actually answer ` +
    `"${sourceText.trim()}" from scratch. Set AI_PROVIDER to "anthropic" or "gemini" (with a real ` +
    `API key) to get an actual explanation adapted into these views.`;
  const concepts =
    realConceptCount > 0
      ? extractConcepts(sourceText, 8).filter((c) => !c.startsWith('concept '))
      : ['mock mode'];
  const nodes = concepts.map((c) => ({ id: slug(c), label: titleCase(c) }));

  return {
    source_text: sourceText,
    essential_concepts: concepts,
    readable: { sections: [{ heading: 'Mock mode limitation', body: notice, key_terms: [] }] },
    focused: {
      stages: [{ step: 1, title: 'Mock mode limitation', body: notice }],
      key_takeaway: notice,
    },
    visual: {
      structure_type: 'non_spatial',
      type: 'cards',
      nodes: nodes.length ? nodes : [{ id: 'mock_mode', label: 'Mock mode' }],
      edges: [],
    },
    fidelity: { preserved: concepts, pedagogical_aids: [], unsupported_additions: [] },
    quiz: [0, 1, 2].map((i) => ({
      question: `This question can't be generated in mock mode. (${i + 1}/3)`,
      choices: ['Switch to a real provider', 'Not available', 'Not available', 'Not available'],
      answer_index: 0,
      concept_id: slug(concepts[0] || 'mock'),
      bloom_level: ['recall', 'relationship', 'application'][i],
    })),
  };
}

export async function adapt(sourceText) {
  if (sourceText.trim() === SAMPLE_TEXT.trim()) {
    return structuredClone(SAMPLE_RESPONSE);
  }

  const sentences = splitSentences(sourceText);
  const rawConcepts = extractConcepts(sourceText, 8);
  const realConceptCount = rawConcepts.filter((c) => !c.startsWith('concept ')).length;
  if (realConceptCount < 2) {
    return thinInputNotice(sourceText, realConceptCount);
  }
  const concepts = rawConcepts;

  const sectionGroups = chunk(sentences, Math.min(4, Math.max(1, Math.ceil(sentences.length / 2))));
  const readable = {
    sections: sectionGroups.map((group, i) => ({
      heading: `Part ${i + 1}`,
      body: group.join(' '),
      key_terms: concepts.filter((c) => group.join(' ').toLowerCase().includes(c)).slice(0, 3),
    })),
  };

  const stageGroups = chunk(sentences, 4);
  const focused = {
    stages: stageGroups.map((group, i) => ({
      step: i + 1,
      title: `Step ${i + 1}`,
      body: group.join(' '),
    })),
    key_takeaway: sentences[sentences.length - 1] || 'No content provided.',
  };

  const nodes = concepts.map((c) => ({ id: slug(c), label: titleCase(c) }));
  const edges = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    edges.push({ from: nodes[i].id, to: nodes[i + 1].id, label: 'appears near', directional: false });
  }
  const visual = { structure_type: 'relational', type: 'concept_map', nodes, edges };

  // Fixed recall / relationship / application rubric, built as fill-in-the-blank over concepts
  // that actually occur in a source sentence - never invented content.
  const quizConcepts = concepts.slice(0, 4);
  const bloomLevels = ['recall', 'relationship', 'application'];
  const quiz = bloomLevels.map((level, i) => {
    const correct = quizConcepts[i % quizConcepts.length];
    const sentence = sentences.find((s) => s.toLowerCase().includes(correct)) || sentences[0];
    const blanked = sentence.replace(new RegExp(correct, 'i'), '_____');
    const distractors = quizConcepts.filter((c) => c !== correct).slice(0, 3);
    while (distractors.length < 3) distractors.push(`concept ${distractors.length + 1}`);
    const choices = [titleCase(correct), ...distractors.map(titleCase)];
    return {
      question: `Which word completes this line from the lesson? "${blanked}"`,
      choices,
      answer_index: 0,
      concept_id: slug(correct),
      bloom_level: level,
    };
  });

  return {
    source_text: sourceText,
    essential_concepts: concepts,
    readable,
    focused,
    visual,
    fidelity: {
      preserved: concepts,
      pedagogical_aids: [],
      unsupported_additions: [],
    },
    quiz,
  };
}
