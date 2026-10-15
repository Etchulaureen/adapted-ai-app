// Prism - client-side state and rendering for the 5-screen MVP flow.

const SAMPLE_TEXT = `Photosynthesis converts light energy into chemical energy in photoautotrophic organisms. It occurs mainly in chloroplasts, where chlorophyll absorbs light. Carbon dioxide and water are transformed into glucose and oxygen is released. Light-dependent reactions in thylakoid membranes produce ATP and NADPH; the Calvin cycle in the stroma uses them for carbon fixation and synthesis of organic molecules.`;

// A curated icon set for Visual mode nodes. Concepts are arbitrary user text, so this is
// necessarily a keyword heuristic, not a full match - "generic" is a deliberately real symbol
// (a tag/concept mark), not a blank box, so an unmatched concept still reads as pictorial.
// Two-tone (soft fill + solid accent + dark stroke detail) rather than flat outlines, so each
// icon reads as a small illustration instead of a line-art glyph.
const ICON_SVG = {
  light: '<svg width="26" height="26" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.2" fill="#f4c453" stroke="#0a6b5c" stroke-width="1.4"/><path d="M12 2.5v3M12 18.5v3M4.7 4.7l2.1 2.1M17.2 17.2l2.1 2.1M2.5 12h3M18.5 12h3M4.7 19.3l2.1-2.1M17.2 6.8l2.1-2.1" stroke="#0f9b86" stroke-width="1.8" stroke-linecap="round"/></svg>',
  leaf: '<svg width="26" height="26" viewBox="0 0 24 24"><path d="M5 19c8-1 12-6 13-13-8 1-12 6-13 13z" fill="#7fb96a" stroke="#0a6b5c" stroke-width="1.4" stroke-linejoin="round"/><path d="M6.5 17.5c2.5-3.5 5.5-6.5 10-10" stroke="#0a6b5c" stroke-width="1.2" stroke-linecap="round"/></svg>',
  water: '<svg width="26" height="26" viewBox="0 0 24 24"><path d="M12 3c3.5 4.5 6 7.7 6 10.8A6 6 0 1 1 6 13.8C6 10.7 8.5 7.5 12 3z" fill="#6db3e8" stroke="#0a6b5c" stroke-width="1.4" stroke-linejoin="round"/><path d="M9.5 15.5a3 3 0 0 0 3 2" stroke="#eaf5ff" stroke-width="1.4" stroke-linecap="round"/></svg>',
  energy: '<svg width="26" height="26" viewBox="0 0 24 24"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" fill="#f2b632" stroke="#0a6b5c" stroke-width="1.4" stroke-linejoin="round"/></svg>',
  cycle: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M4 12a8 8 0 0 1 13.9-5.4M20 12a8 8 0 0 1-13.9 5.4" stroke="#0f9b86" stroke-width="2" stroke-linecap="round"/><path d="M18 3v4h-4M6 21v-4h4" fill="#7fc7bb" stroke="#0a6b5c" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  molecule: '<svg width="26" height="26" viewBox="0 0 24 24"><path d="M8 8l3 8M16 8l-3 8" stroke="#0a6b5c" stroke-width="1.6" stroke-linecap="round"/><circle cx="6" cy="7" r="2.6" fill="#c96f5c" stroke="#0a6b5c" stroke-width="1.2"/><circle cx="18" cy="7" r="2.6" fill="#6db3e8" stroke="#0a6b5c" stroke-width="1.2"/><circle cx="12" cy="18" r="2.6" fill="#7fb96a" stroke="#0a6b5c" stroke-width="1.2"/></svg>',
  habitat: '<svg width="26" height="26" viewBox="0 0 24 24"><path d="M6 10.5v9h12v-9" fill="#e6d3a8" stroke="#0a6b5c" stroke-width="1.4"/><path d="M3.5 11 12 4l8.5 7" fill="none" stroke="#a3432f" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 19v-5h4v5" fill="#8a6a3f" stroke="#0a6b5c" stroke-width="1.2" stroke-linejoin="round"/></svg>',
  animal: '<svg width="26" height="26" viewBox="0 0 24 24"><circle cx="12" cy="15" r="3.6" fill="#c9a877" stroke="#0a6b5c" stroke-width="1.3"/><circle cx="6" cy="9" r="1.8" fill="#c9a877" stroke="#0a6b5c" stroke-width="1.1"/><circle cx="18" cy="9" r="1.8" fill="#c9a877" stroke="#0a6b5c" stroke-width="1.1"/><circle cx="9.3" cy="6.3" r="1.8" fill="#c9a877" stroke="#0a6b5c" stroke-width="1.1"/><circle cx="14.7" cy="6.3" r="1.8" fill="#c9a877" stroke="#0a6b5c" stroke-width="1.1"/></svg>',
  globe: '<svg width="26" height="26" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="#6db3e8" stroke="#0a6b5c" stroke-width="1.4"/><path d="M4.5 9c2 1 13.5 1 15 0M4.5 15c2-1 13.5-1 15 0" stroke="#eaf5ff" stroke-width="1.1"/><path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z" fill="none" stroke="#eaf5ff" stroke-width="1.1"/><path d="M8 7c2 3 1 7-1 10M17 8c-2 2-2 6 0 8" fill="none" stroke="#7fb96a" stroke-width="1.6" stroke-linecap="round"/></svg>',
  temperature: '<svg width="26" height="26" viewBox="0 0 24 24"><path d="M10.5 5a1.5 1.5 0 0 1 3 0v9a4 4 0 1 1-3 0z" fill="#f2f2f2" stroke="#0a6b5c" stroke-width="1.3"/><path d="M11.5 10v6" stroke="#c9503c" stroke-width="2.6" stroke-linecap="round"/><circle cx="12" cy="17" r="2.2" fill="#c9503c"/></svg>',
  network: '<svg width="26" height="26" viewBox="0 0 24 24"><path d="M7 17a4 4 0 0 1-1-7.9A5.5 5.5 0 0 1 16.8 8 4.2 4.2 0 0 1 17 17H7z" fill="#eef1f5" stroke="#0a6b5c" stroke-width="1.3"/><circle cx="8" cy="17" r="1.3" fill="#0f9b86"/><circle cx="12" cy="17" r="1.3" fill="#0f9b86"/><circle cx="16" cy="17" r="1.3" fill="#0f9b86"/></svg>',
  document: '<svg width="26" height="26" viewBox="0 0 24 24"><path d="M6 3h9l3 3v15H6z" fill="#f4efd9" stroke="#0a6b5c" stroke-width="1.3" stroke-linejoin="round"/><path d="M9 10h6M9 13.5h6M9 17h4" stroke="#8a6a3f" stroke-width="1.3" stroke-linecap="round"/></svg>',
  money: '<svg width="26" height="26" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" fill="#f2d675" stroke="#0a6b5c" stroke-width="1.4"/><path d="M12 7.5v9M9.5 9.7c0-1.3 1.1-2.2 2.5-2.2s2.5.7 2.5 1.8c0 2.6-5 1.4-5 4 0 1.1 1.1 1.8 2.5 1.8s2.5-.9 2.5-2.2" stroke="#8a6a1f" stroke-width="1.2" stroke-linecap="round"/></svg>',
  brain: '<svg width="26" height="26" viewBox="0 0 24 24"><path d="M9 4.5a3 3 0 0 0-3 3v.3A3 3 0 0 0 5 13a3 3 0 0 0 1.5 5.5H9a2 2 0 0 0 2-2v-9a3 3 0 0 0-2-2.9zM15 4.5a3 3 0 0 1 3 3v.3A3 3 0 0 1 19 13a3 3 0 0 1-1.5 5.5H15a2 2 0 0 1-2-2v-9a3 3 0 0 1 2-2.9z" fill="#d9a3c9" stroke="#0a6b5c" stroke-width="1.1" stroke-linejoin="round"/></svg>',
  health: '<svg width="26" height="26" viewBox="0 0 24 24"><path d="M12 20.3 4.6 13a4.6 4.6 0 0 1 6.5-6.5l.9.9.9-.9a4.6 4.6 0 0 1 6.5 6.5z" fill="#e08a8a" stroke="#0a6b5c" stroke-width="1.3" stroke-linejoin="round"/><path d="M9 12.5h2l1-2 1.5 3 1-1H16" stroke="#fff" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  mechanism: '<svg width="26" height="26" viewBox="0 0 24 24"><path d="M12 8.3a3.7 3.7 0 1 0 0 7.4 3.7 3.7 0 0 0 0-7.4z" fill="#c7ccd4" stroke="#0a6b5c" stroke-width="1.2"/><path d="M12 3v2.2M12 18.8V21M21 12h-2.2M5.2 12H3M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6M18.4 18.4l-1.6-1.6M7.2 7.2 5.6 5.6" stroke="#0a6b5c" stroke-width="1.6" stroke-linecap="round"/></svg>',
  data: '<svg width="26" height="26" viewBox="0 0 24 24"><path d="M4 20V10M10 20V4M16 20v-7M4 20h16" stroke="#0a6b5c" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><rect x="2.3" y="10" width="3.4" height="10" rx=".6" fill="#6db3e8"/><rect x="8.3" y="4" width="3.4" height="16" rx=".6" fill="#0f9b86"/><rect x="14.3" y="13" width="3.4" height="7" rx=".6" fill="#f2b632"/></svg>',
  time: '<svg width="26" height="26" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" fill="#f4efd9" stroke="#0a6b5c" stroke-width="1.4"/><path d="M12 7v5.5l3.8 2.2" stroke="#a3432f" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  map: '<svg width="26" height="26" viewBox="0 0 24 24"><path d="M12 21s-6.5-6-6.5-11A6.5 6.5 0 0 1 18.5 10c0 5-6.5 11-6.5 11z" fill="#c9503c" stroke="#0a6b5c" stroke-width="1.3" stroke-linejoin="round"/><circle cx="12" cy="9.7" r="2.2" fill="#fff"/></svg>',
  book: '<svg width="26" height="26" viewBox="0 0 24 24"><path d="M12 5.5c-1.7-1-4.4-1.4-7-1v13c2.6-.4 5.3 0 7 1 1.7-1 4.4-1.4 7-1v-13c-2.6-.4-5.3 0-7 1z" fill="#f4c453" stroke="#0a6b5c" stroke-width="1.3" stroke-linejoin="round"/><path d="M12 5.5v13" stroke="#0a6b5c" stroke-width="1.1"/></svg>',
  generic: '<svg width="26" height="26" viewBox="0 0 24 24"><path d="M12 3 4 8v8l8 5 8-5V8l-8-5z" fill="#dfe6ea" stroke="#0a6b5c" stroke-width="1.4" stroke-linejoin="round"/><circle cx="12" cy="12" r="2.4" fill="#0f9b86"/></svg>',
};
const ICON_KEYWORDS = [
  [/light|sun|photon/, 'light'],
  [/leaf|plant|chloroph|chloroplast|photosynth|forest|tree|vegetat/, 'leaf'],
  [/water|rain|ocean|sea|river|moist|humid/, 'water'],
  [/energy|atp|nadph|power|electric|voltage/, 'energy'],
  [/cycle|calvin|loop|cyclic|rotation/, 'cycle'],
  [/molecule|atom|chemical|compound|carbon|oxygen|co2|co₂|glucose/, 'molecule'],
  [/habitat|nest|shelter|ecosystem|environment|\bhome\b/, 'habitat'],
  [/animal|species|organism|wildlife|fauna/, 'animal'],
  [/earth|climate|global|planet|atmosphere/, 'globe'],
  [/temperature|heat|cold/, 'temperature'],
  [/network|server|cloud|internet|computer|software|vpc|subnet|database/i, 'network'],
  [/history|document|policy|law|govern|treaty|war|revolution|empire|constitution/, 'document'],
  [/money|economy|trade|market|currency|finance|tax|price|bank/, 'money'],
  [/brain|mind|thought|cognition|memory|learning|psycholog/, 'brain'],
  [/health|heart|medicine|disease|body|blood|medical|virus|cell\b/, 'health'],
  [/mechanism|machine|engine|gear|mechanical|reaction|process/, 'mechanism'],
  [/data|statistic|chart|graph|analysis|measurement/, 'data'],
  [/\btime\b|clock|duration|century|\byear|\bera\b|period|decade/, 'time'],
  [/geography|map|location|region|country|continent|territory/, 'map'],
  [/education|book|curriculum|school|teach|student|literature/, 'book'],
];
function conceptIcon(label) {
  const lc = (label || '').toLowerCase();
  const match = ICON_KEYWORDS.find(([re]) => re.test(lc));
  return ICON_SVG[match ? match[1] : 'generic'];
}

const SCREEN_STEPS = { home: null, input: 1, preference: 2, lesson: 3, quiz: 4 };
const SCREEN_LABELS = {
  input: 'Step 1 of 4 · Add content',
  preference: 'Step 2 of 4 · Choose presentation',
  lesson: 'Step 3 of 4 · Adapted lesson',
  quiz: 'Step 4 of 4 · Check understanding',
};

const state = {
  screen: 'home',
  sourceText: '',
  selectedMode: null,
  activeMode: null,
  stage: 1,
  response: null,
  quizIndex: 0,
  quizPicked: null,
  quizResults: [], // {correct: bool}
};

const el = (id) => document.getElementById(id);

// ---- Reading settings (accessibility) ----
// Persisted in localStorage and mirrored onto <html> as data-* attributes that styles.css
// keys off, so a learner's presentation choices apply on every screen and survive a reload.
const SETTINGS_KEY = 'prism.settings.v1';
const SETTINGS_DEFAULTS = {
  textSize: 'm',
  lineHeight: 'normal',
  letterSpacing: 'normal',
  typeface: 'default',
  theme: 'light',
  reduceMotion: false,
  ruler: false,
};
const SEG_SETTINGS = ['textSize', 'lineHeight', 'letterSpacing', 'typeface', 'theme'];

function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
    return { ...SETTINGS_DEFAULTS, ...saved };
  } catch {
    return { ...SETTINGS_DEFAULTS };
  }
}

let settings = loadSettings();

function applySettings() {
  const root = document.documentElement;
  root.dataset.textSize = settings.textSize;
  root.dataset.lineHeight = settings.lineHeight;
  root.dataset.letterSpacing = settings.letterSpacing;
  root.dataset.typeface = settings.typeface;
  root.dataset.theme = settings.theme;
  root.dataset.reduceMotion = settings.reduceMotion ? '1' : '0';
  el('reading-ruler').hidden = !settings.ruler;
}

function saveSettings() {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    /* private mode / storage disabled - settings still apply for this session */
  }
}

function syncSettingsPanel() {
  SEG_SETTINGS.forEach((key) => {
    document.querySelectorAll(`.seg-control[data-setting="${key}"] button`).forEach((b) => {
      b.classList.toggle('on', b.dataset.value === settings[key]);
    });
  });
  el('set-reduce-motion').checked = settings.reduceMotion;
  el('set-ruler').checked = settings.ruler;
}

function openSettings() {
  syncSettingsPanel();
  el('settings-backdrop').hidden = false;
  el('settings-panel').hidden = false;
  el('btn-settings').setAttribute('aria-expanded', 'true');
  el('btn-settings-close').focus();
}
function closeSettings() {
  el('settings-backdrop').hidden = true;
  el('settings-panel').hidden = true;
  el('btn-settings').setAttribute('aria-expanded', 'false');
  el('btn-settings').focus();
}

el('btn-settings').addEventListener('click', openSettings);
el('btn-settings-close').addEventListener('click', closeSettings);
el('settings-backdrop').addEventListener('click', closeSettings);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !el('settings-panel').hidden) closeSettings();
});

document.querySelectorAll('.seg-control').forEach((group) => {
  group.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    settings[group.dataset.setting] = btn.dataset.value;
    applySettings();
    saveSettings();
    syncSettingsPanel();
  });
});
el('set-reduce-motion').addEventListener('change', (e) => {
  settings.reduceMotion = e.target.checked;
  applySettings();
  saveSettings();
});
el('set-ruler').addEventListener('change', (e) => {
  settings.ruler = e.target.checked;
  applySettings();
  saveSettings();
});
el('btn-settings-reset').addEventListener('click', () => {
  settings = { ...SETTINGS_DEFAULTS };
  applySettings();
  saveSettings();
  syncSettingsPanel();
});

document.addEventListener('pointermove', (e) => {
  if (!settings.ruler) return;
  el('reading-ruler').style.top = `${e.clientY - 18}px`;
});

applySettings();

function showScreen(name) {
  if (typeof ttsStop === 'function') ttsStop();
  state.screen = name;
  document.querySelectorAll('.screen').forEach((s) => s.classList.remove('active'));
  el(`screen-${name}`).classList.add('active');

  const step = SCREEN_STEPS[name];
  const progress = el('progress');
  const stepLabel = el('step-label');
  if (step === null) {
    progress.hidden = true;
    stepLabel.textContent = '';
  } else {
    progress.hidden = false;
    stepLabel.textContent = SCREEN_LABELS[name];
    document.querySelectorAll('.progress .seg').forEach((seg) => {
      seg.classList.toggle('done', Number(seg.dataset.seg) <= step);
    });
  }
}

// ---- Screen 1: Home ----
el('btn-start').addEventListener('click', () => showScreen('input'));
el('btn-sample').addEventListener('click', () => {
  el('source-text').value = SAMPLE_TEXT;
  onSourceTextChange();
  showScreen('input');
});
el('btn-load-session').addEventListener('click', () => el('file-load').click());
el('file-load').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      loadSession(JSON.parse(reader.result));
    } catch (err) {
      alert('That file could not be read as a saved Prism session.');
    }
  };
  reader.readAsText(file);
});

// ---- Screen 2: Content input ----
function onSourceTextChange() {
  state.sourceText = el('source-text').value;
  const n = state.sourceText.trim().length;
  el('char-count').textContent = `${n} character${n === 1 ? '' : 's'}`;
  el('btn-to-preference').disabled = n === 0;
}
el('source-text').addEventListener('input', onSourceTextChange);
el('btn-sample-2').addEventListener('click', () => {
  el('source-text').value = SAMPLE_TEXT;
  onSourceTextChange();
});
el('btn-sample-question').addEventListener('click', () => {
  el('source-text').value = 'What is a habitat?';
  onSourceTextChange();
});
el('btn-to-preference').addEventListener('click', () => showScreen('preference'));

// ---- Screen 3: Preference ----
const MODE_NAMES = { readable: 'Readable', focused: 'Focused', visual: 'Visual', compare: 'Compare' };
el('mode-grid').addEventListener('click', (e) => {
  const card = e.target.closest('.mode-card');
  if (!card) return;
  state.selectedMode = card.dataset.mode;
  document.querySelectorAll('.mode-card').forEach((c) => c.classList.toggle('selected', c === card));
  el('btn-generate').disabled = false;
  el('generate-label').textContent = `Continue with ${MODE_NAMES[state.selectedMode]}`;
});

el('btn-generate').addEventListener('click', async () => {
  el('generate-error').hidden = true;
  el('generating').hidden = false;
  el('btn-generate').disabled = true;
  try {
    const res = await fetch('/api/adapt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sourceText: state.sourceText }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Adaptation failed.');
    state.response = data;
    state.activeMode = state.selectedMode;
    state.stage = 1;
    renderLesson();
    showScreen('lesson');
  } catch (err) {
    el('generate-error').textContent = err.message;
    el('generate-error').hidden = false;
  } finally {
    el('generating').hidden = true;
    el('btn-generate').disabled = false;
  }
});

// ---- Screen 4: Adapted lesson ----
el('mode-tabs').addEventListener('click', (e) => {
  const tab = e.target.closest('.tab');
  if (!tab) return;
  state.activeMode = tab.dataset.mode;
  renderLesson();
});

function renderLesson() {
  if (!state.response) return;
  ttsStop();
  fidelityActive = null;
  document.querySelectorAll('#mode-tabs .tab').forEach((t) => {
    t.classList.toggle('active', t.dataset.mode === state.activeMode);
  });

  const host = el('lesson-content');
  host.innerHTML = '';
  if (state.activeMode === 'readable') host.appendChild(renderReadable());
  else if (state.activeMode === 'focused') host.appendChild(renderFocused());
  else if (state.activeMode === 'visual') host.appendChild(renderVisual());
  else if (state.activeMode === 'compare') host.appendChild(renderCompare());

  tagTtsBlocks();
  renderFidelity();
}

// Mark the text-bearing elements the read-aloud feature steps through and highlights.
function tagTtsBlocks() {
  el('lesson-content')
    .querySelectorAll('h2, h3, p, li, .node-text, .compare-label')
    .forEach((n) => {
      if (n.textContent.trim()) n.classList.add('tts-block');
    });
}

function renderReadable() {
  const wrap = document.createElement('div');
  wrap.style.display = 'flex';
  wrap.style.flexDirection = 'column';
  wrap.style.gap = '1.1rem';
  const h2 = document.createElement('h2');
  h2.style.fontSize = '1.3rem';
  h2.textContent = 'Readable';
  wrap.appendChild(h2);

  state.response.readable.sections.forEach((sec) => {
    const block = document.createElement('div');
    const h3 = document.createElement('h3');
    h3.style.fontSize = '1rem';
    h3.style.color = 'var(--accent-deep)';
    h3.textContent = sec.heading;
    const p = document.createElement('p');
    p.style.margin = '.3rem 0 0 0';
    p.style.color = 'var(--ink-soft)';
    p.textContent = sec.body;
    block.appendChild(h3);
    block.appendChild(p);
    wrap.appendChild(block);
  });
  return wrap;
}

function renderFocused() {
  const stages = state.response.focused.stages;
  if (state.stage > stages.length) state.stage = stages.length;
  if (state.stage < 1) state.stage = 1;

  const wrap = document.createElement('div');
  wrap.style.display = 'flex';
  wrap.style.flexDirection = 'column';
  wrap.style.gap = '.6rem';

  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.alignItems = 'baseline';
  header.style.justifyContent = 'space-between';
  header.innerHTML = `<h2 style="font-size:1.3rem;">Focused</h2><span style="font-size:.85rem; color:var(--muted); font-weight:700;">Stage ${state.stage} of ${stages.length}</span>`;
  wrap.appendChild(header);

  stages.forEach((s, i) => {
    const n = i + 1;
    const row = document.createElement('div');
    row.className = 'stage-row ' + (n < state.stage ? 'done' : n === state.stage ? 'current' : 'locked');
    const badgeBg = n < state.stage ? 'var(--focused)' : n === state.stage ? 'var(--focused-deep)' : 'var(--line)';
    const badgeColor = n <= state.stage ? '#fff' : 'var(--muted)';
    const mark = n < state.stage ? '✓' : String(n);
    if (n === state.stage) {
      row.innerHTML = `
        <div style="display:flex; align-items:center; gap:1rem;">
          <div class="stage-badge" style="background:${badgeBg}; color:${badgeColor};">${mark}</div>
          <div style="font-weight:700; font-size:1.05rem;">${escapeHtml(s.title)}</div>
        </div>
        <p style="margin:0 0 0 3rem; font-size:1rem; color:var(--ink-soft); max-width:52ch;">${escapeHtml(s.body)}</p>`;
    } else {
      row.innerHTML = `
        <div class="stage-badge" style="background:${badgeBg}; color:${badgeColor};">${mark}</div>
        <div style="font-weight:700; font-size:.98rem; ${n > state.stage ? 'color:var(--muted);' : ''}">${escapeHtml(s.title)}</div>`;
    }
    wrap.appendChild(row);
  });

  if (state.stage === stages.length) {
    const takeaway = document.createElement('div');
    takeaway.style.cssText = 'background:var(--focused-soft); border-radius:12px; padding:1rem 1.2rem; margin-top:.4rem;';
    takeaway.innerHTML = `<div style="font-weight:800; font-size:.9rem; color:var(--focused-deep); margin-bottom:.3rem;">Key takeaway</div><div style="font-size:.95rem; color:var(--ink-soft);">${escapeHtml(state.response.focused.key_takeaway)}</div>`;
    wrap.appendChild(takeaway);
  }

  const nav = document.createElement('div');
  nav.style.cssText = 'display:flex; justify-content:space-between; align-items:center; margin-top:.5rem;';
  nav.innerHTML = `
    <button class="btn btn-ghost" id="stage-back" ${state.stage === 1 ? 'disabled' : ''}>Back</button>
    <button class="btn btn-primary" id="stage-next" ${state.stage === stages.length ? 'disabled' : ''}>Next stage</button>`;
  wrap.appendChild(nav);

  wrap.querySelector('#stage-back').addEventListener('click', () => { state.stage--; renderLesson(); });
  wrap.querySelector('#stage-next').addEventListener('click', () => { state.stage++; renderLesson(); });

  return wrap;
}

function renderVisual(compact = false) {
  const v = state.response.visual;
  const wrap = document.createElement('div');
  if (!compact) {
    const h2 = document.createElement('h2');
    h2.style.fontSize = '1.3rem';
    h2.style.marginBottom = '.6rem';
    h2.textContent = 'Visual';
    wrap.appendChild(h2);
  }

  const makeNodeCard = (node) => {
    const box = document.createElement('div');
    box.className = 'node';
    box.innerHTML = `<div class="node-icon">${conceptIcon(node.label)}</div><div class="node-text">${escapeHtml(node.label)}</div>`;
    return box;
  };

  if (v.structure_type === 'sequence') {
    const row = document.createElement('div');
    row.className = 'node-flow';
    v.nodes.forEach((node, i) => {
      row.appendChild(makeNodeCard(node));
      if (i < v.nodes.length - 1) {
        const arrow = document.createElement('span');
        arrow.className = 'node-arrow';
        arrow.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="#0f9b86" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        row.appendChild(arrow);
      }
    });
    wrap.appendChild(row);
  } else {
    const grid = document.createElement('div');
    grid.style.cssText = 'display:grid; grid-template-columns:repeat(auto-fit,minmax(140px,1fr)); gap:.8rem;';
    v.nodes.forEach((node) => grid.appendChild(makeNodeCard(node)));
    wrap.appendChild(grid);
    if (v.edges.length) {
      const rel = document.createElement('div');
      rel.style.cssText = 'margin-top:1rem; display:flex; flex-direction:column; gap:.4rem; font-size:.88rem; color:var(--ink-soft);';
      v.edges.forEach((e) => {
        const from = v.nodes.find((n) => n.id === e.from)?.label || e.from;
        const to = v.nodes.find((n) => n.id === e.to)?.label || e.to;
        const line = document.createElement('div');
        line.textContent = `${from} ${e.label ? `— ${e.label} —` : '—'} ${to}`;
        rel.appendChild(line);
      });
      wrap.appendChild(rel);
    }
  }
  return wrap;
}

function renderCompare() {
  const wrap = document.createElement('div');
  const h2 = document.createElement('h2');
  h2.style.fontSize = '1.3rem';
  h2.style.marginBottom = '.6rem';
  h2.textContent = 'Compare';
  wrap.appendChild(h2);
  const sub = document.createElement('p');
  sub.style.cssText = 'margin:0 0 .8rem 0; font-size:.9rem; color:var(--muted);';
  sub.textContent = 'The original, side by side with every adapted representation — same facts, four shapes.';
  wrap.appendChild(sub);

  const grid = document.createElement('div');
  grid.className = 'compare-grid';

  // 1. Original
  const orig = document.createElement('div');
  orig.className = 'compare-col original';
  orig.innerHTML = `<div class="compare-label" style="color:var(--muted);">Original</div><p style="margin:0; font-size:.88rem; color:var(--ink-soft);">${escapeHtml(state.sourceText)}</p>`;
  grid.appendChild(orig);

  // 2. Readable
  const readable = document.createElement('div');
  readable.className = 'compare-col adapted';
  readable.style.background = 'var(--readable-soft)';
  const readableBody = state.response.readable.sections.map((s) => s.body).join(' ');
  readable.innerHTML = `<div class="compare-label" style="color:var(--readable-deep);">Readable</div><p style="margin:0; font-size:.88rem; color:var(--ink-soft);">${escapeHtml(readableBody)}</p>`;
  grid.appendChild(readable);

  // 3. Focused
  const focused = document.createElement('div');
  focused.className = 'compare-col adapted';
  focused.style.background = 'var(--focused-soft)';
  const stageItems = state.response.focused.stages
    .map((s, i) => `<li><span class="num">${i + 1}.</span> ${escapeHtml(s.title)}</li>`)
    .join('');
  focused.innerHTML = `
    <div class="compare-label" style="color:var(--focused-deep);">Focused</div>
    <ol class="compare-stage-list">${stageItems}</ol>
    <p style="margin:.6rem 0 0 0; font-size:.82rem; color:var(--ink-soft); font-style:italic;">${escapeHtml(state.response.focused.key_takeaway)}</p>`;
  grid.appendChild(focused);

  // 4. Visual
  const visual = document.createElement('div');
  visual.className = 'compare-col adapted';
  visual.style.background = 'var(--visual-soft)';
  const label = document.createElement('div');
  label.className = 'compare-label';
  label.style.color = 'var(--visual-deep)';
  label.textContent = 'Visual';
  visual.appendChild(label);
  visual.appendChild(renderVisual(true));
  grid.appendChild(visual);

  wrap.appendChild(grid);
  return wrap;
}

// The term (concept / aid / addition) whose occurrences are currently highlighted, or null.
let fidelityActive = null;

function fidelitySource() {
  return state.response?.source_text || state.sourceText || '';
}

function renderFidelity() {
  const f = state.response.fidelity;
  const concepts = state.response.essential_concepts;

  const pillsHost = el('fidelity-pills');
  pillsHost.innerHTML = '';
  const pill = (cls, text) => {
    const s = document.createElement('span');
    s.className = `pill ${cls}`;
    s.textContent = text;
    pillsHost.appendChild(s);
  };
  pill('pill-ok', `${f.preserved.length} / ${concepts.length} concepts preserved`);
  pill('pill-info', `${f.pedagogical_aids.length} aid${f.pedagogical_aids.length === 1 ? '' : 's'} added`);
  pill(
    f.unsupported_additions.length ? 'pill-warn' : 'pill-ok',
    `${f.unsupported_additions.length} unsupported addition${f.unsupported_additions.length === 1 ? '' : 's'}`,
  );

  // Concepts - dropped ones (not in fidelity.preserved) shown struck through.
  const preservedSet = new Set(f.preserved.map((s) => s.trim().toLowerCase()));
  const conceptHost = el('fidelity-concepts');
  conceptHost.innerHTML = '';
  el('fidelity-concept-count').textContent = `(${f.preserved.length}/${concepts.length})`;
  concepts.forEach((c) => {
    const dropped = !preservedSet.has(c.trim().toLowerCase());
    conceptHost.appendChild(
      makeFidelityChip(c, c, dropped ? 'chip-dropped' : '', dropped ? 'Not listed as preserved by the fidelity check' : ''),
    );
  });

  // Pedagogical aids.
  const aidHost = el('fidelity-aids');
  aidHost.innerHTML = '';
  el('fidelity-aids-section').hidden = f.pedagogical_aids.length === 0;
  f.pedagogical_aids.forEach((a) => {
    aidHost.appendChild(makeFidelityChip(`${a.type} · ${a.text}`, a.text, 'chip-aid', ''));
  });

  // Unsupported additions.
  const addHost = el('fidelity-additions');
  addHost.innerHTML = '';
  el('fidelity-additions-section').hidden = f.unsupported_additions.length === 0;
  f.unsupported_additions.forEach((t) => {
    addHost.appendChild(makeFidelityChip(t, t, 'chip-warn', ''));
  });

  const src = fidelitySource();
  el('fidelity-source-wrap').hidden = !src;
  el('fidelity-source').textContent = src;

  if (fidelityActive) applyFidelityHighlight(fidelityActive);
  markActiveChips();
}

function makeFidelityChip(label, term, extraClass, title) {
  const b = document.createElement('button');
  b.className = 'chip' + (extraClass ? ` ${extraClass}` : '');
  b.dataset.term = term;
  b.textContent = label.length > 96 ? `${label.slice(0, 94)}…` : label;
  if (title) b.title = title;
  b.addEventListener('click', () => {
    if (fidelityActive === term) {
      fidelityActive = null;
      clearFidelityHighlight();
    } else {
      fidelityActive = term;
      applyFidelityHighlight(term);
    }
    markActiveChips();
  });
  return b;
}

function markActiveChips() {
  document.querySelectorAll('.chip').forEach((c) => {
    c.classList.toggle('active', fidelityActive !== null && c.dataset.term === fidelityActive);
  });
}

const HL_STOPWORDS = new Set(['the', 'and', 'for', 'with', 'from', 'that', 'this', 'into', 'are', 'was']);

function termKeywords(term) {
  const cleaned = term.replace(/[+/&]/g, ' ');
  const words = cleaned.split(/[^A-Za-z0-9]+/).filter((w) => w.length >= 3 && !HL_STOPWORDS.has(w.toLowerCase()));
  const list = [];
  if (!/\s/.test(cleaned.trim()) && cleaned.trim().length >= 3) list.push(cleaned.trim());
  words.forEach((w) => list.push(w));
  return [...new Set(list.map((w) => w.toLowerCase()))];
}

function fidelityRoots() {
  return [el('lesson-content'), el('fidelity-source')].filter(Boolean);
}

function clearFidelityHighlight() {
  fidelityRoots().forEach((root) => {
    root.querySelectorAll('mark.hl').forEach((m) => m.replaceWith(document.createTextNode(m.textContent)));
    root.normalize();
  });
}

function applyFidelityHighlight(term) {
  clearFidelityHighlight();
  const keywords = termKeywords(term);
  if (!keywords.length) return;
  const rx = new RegExp(
    keywords.map((k) => `\\b${k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[a-zA-Z]*\\b`).join('|'),
    'gi',
  );

  let firstMark = null;
  fidelityRoots().forEach((root) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) =>
        n.parentElement && n.parentElement.tagName !== 'MARK' && n.nodeValue.trim()
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT,
    });
    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) textNodes.push(node);

    textNodes.forEach((textNode) => {
      const text = textNode.nodeValue;
      rx.lastIndex = 0;
      if (!rx.test(text)) return;
      rx.lastIndex = 0;
      const frag = document.createDocumentFragment();
      let last = 0;
      let m;
      while ((m = rx.exec(text))) {
        if (m[0].length === 0) {
          rx.lastIndex++;
          continue;
        }
        if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
        const mk = document.createElement('mark');
        mk.className = 'hl';
        mk.textContent = m[0];
        frag.appendChild(mk);
        firstMark = firstMark || mk;
        last = m.index + m[0].length;
      }
      if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
      textNode.parentNode.replaceChild(frag, textNode);
    });
  });

  if (firstMark) firstMark.scrollIntoView({ block: 'center', behavior: settings.reduceMotion ? 'auto' : 'smooth' });
}

el('btn-to-quiz').addEventListener('click', () => {
  state.quizIndex = 0;
  state.quizPicked = null;
  state.quizResults = [];
  renderQuiz();
  showScreen('quiz');
});

// ---- Screen 5: Quiz ----
function renderQuiz() {
  ttsStop();
  const quiz = state.response.quiz;
  const host = el('quiz-body');

  if (state.quizIndex >= quiz.length) {
    const correct = state.quizResults.filter((r) => r.correct).length;
    host.innerHTML = `
      <div class="quiz-result">
        <h2 class="tts-block" style="font-size:1.6rem;">You got ${correct} of ${quiz.length}</h2>
        <p class="tts-block" style="color:var(--ink-soft); max-width:48ch;">These questions were generated from the original lesson, so this reflects the same understanding regardless of which presentation you used.</p>
        <button class="btn btn-primary" id="btn-restart">Adapt another lesson</button>
      </div>`;
    host.querySelector('#btn-restart').addEventListener('click', () => {
      state.response = null;
      state.selectedMode = null;
      state.sourceText = '';
      el('source-text').value = '';
      onSourceTextChange();
      document.querySelectorAll('.mode-card').forEach((c) => c.classList.remove('selected'));
      el('btn-generate').disabled = true;
      showScreen('home');
    });
    return;
  }

  const q = quiz[state.quizIndex];
  const dots = quiz.map((_, i) =>
    `<div class="qdot ${i < state.quizIndex ? 'done' : i === state.quizIndex ? 'current' : ''}"></div>`
  ).join('');

  host.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:.6rem; align-items:flex-start;">
      <div style="display:flex; align-items:center; gap:.5rem;">${dots}</div>
      <span style="font-size:.85rem; color:var(--muted); font-weight:700;">Question ${state.quizIndex + 1} of ${quiz.length}</span>
      <p style="margin:0; font-size:.85rem; color:var(--muted); max-width:56ch;">These questions come from the original lesson — not the version you just read.</p>
    </div>
    <h2 class="tts-block" style="font-size:1.45rem;">${escapeHtml(q.question)}</h2>
    <div style="display:flex; flex-direction:column; gap:.8rem;" id="quiz-choices"></div>
    <button class="btn btn-primary" id="quiz-next" style="align-self:flex-end;" disabled>Next question</button>`;

  const choicesHost = host.querySelector('#quiz-choices');
  q.choices.forEach((choice, i) => {
    const btn = document.createElement('button');
    btn.className = 'choice tts-block';
    btn.innerHTML = `<span class="radio"></span>${escapeHtml(choice)}`;
    btn.addEventListener('click', () => {
      if (state.quizPicked !== null) return; // lock after first pick
      state.quizPicked = i;
      const correct = i === q.answer_index;
      state.quizResults[state.quizIndex] = { correct };
      [...choicesHost.children].forEach((c, ci) => {
        if (ci === i) {
          c.classList.add(correct ? 'right' : 'wrong');
          c.querySelector('.radio').textContent = correct ? '✓' : '✗';
        } else if (ci === q.answer_index) {
          c.classList.add('right');
          c.querySelector('.radio').textContent = '✓';
        }
      });
      host.querySelector('#quiz-next').disabled = false;
    });
    choicesHost.appendChild(btn);
  });

  host.querySelector('#quiz-next').addEventListener('click', () => {
    state.quizIndex++;
    state.quizPicked = null;
    renderQuiz();
  });
}

// ---- Session backup / restore (PRD Section 13) ----
el('btn-save-session').addEventListener('click', () => {
  const session = {
    schema_version: '1.0',
    exported_at: new Date().toISOString(),
    source_text: state.sourceText,
    active_mode: state.activeMode,
    response: state.response,
    quiz_progress: state.quizResults.map((r, i) => ({ question_index: i, correct: r.correct })),
  };
  const blob = new Blob([JSON.stringify(session, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const stamp = session.exported_at.slice(0, 10);
  a.href = url;
  a.download = `prism-session_${stamp}.json`;
  a.click();
  URL.revokeObjectURL(url);
});

function loadSession(session) {
  if (
    !session ||
    session.schema_version !== '1.0' ||
    typeof session.source_text !== 'string' ||
    !session.response
  ) {
    alert('This file is missing required fields or uses an unsupported version, so it was not loaded.');
    return;
  }
  state.sourceText = session.source_text;
  state.response = session.response;
  state.activeMode = session.active_mode || 'readable';
  state.selectedMode = state.activeMode;
  state.stage = 1;
  state.quizResults = (session.quiz_progress || []).map((q) => ({ correct: q.correct }));
  el('source-text').value = state.sourceText;
  onSourceTextChange();
  renderLesson();
  showScreen('lesson');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

// ---- Read aloud (Web Speech API) ----
// Speaks the current screen one text block at a time, highlighting each block as it is read.
// Block-at-a-time (rather than one long utterance) keeps the highlight in sync and sidesteps
// the character limit some engines put on a single utterance.
function ttsSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}

const ttsState = { queue: [], idx: 0, mode: 'idle', context: null, keepAlive: null };
let ttsVoice = null;

function pickVoice() {
  if (!ttsSupported()) return;
  const voices = speechSynthesis.getVoices();
  if (!voices.length) return;
  ttsVoice =
    voices.find((v) => /^en[-_]/i.test(v.lang) && v.localService) ||
    voices.find((v) => /^en/i.test(v.lang)) ||
    voices[0];
}

function ttsSegments(context) {
  const root = context === 'quiz' ? el('quiz-body') : el('lesson-content');
  if (!root) return [];
  return [...root.querySelectorAll('.tts-block')]
    .map((node) => ({ node, text: node.textContent.replace(/\s+/g, ' ').trim() }))
    .filter((s) => s.text);
}

function ttsRate() {
  const v = parseFloat(el('ra-speed').value);
  return Number.isFinite(v) ? v : 1;
}

function ttsClearHighlight() {
  document.querySelectorAll('.tts-block.speaking').forEach((n) => n.classList.remove('speaking'));
}

function ttsSpeakCurrent() {
  ttsClearHighlight();
  if (ttsState.mode !== 'playing') return;
  if (ttsState.idx >= ttsState.queue.length) {
    ttsStop();
    return;
  }
  const seg = ttsState.queue[ttsState.idx];
  seg.node.classList.add('speaking');
  seg.node.scrollIntoView({ block: 'center', behavior: settings.reduceMotion ? 'auto' : 'smooth' });

  const u = new SpeechSynthesisUtterance(seg.text);
  u.rate = ttsRate();
  if (ttsVoice) {
    u.voice = ttsVoice;
    u.lang = ttsVoice.lang;
  }
  const advance = () => {
    if (ttsState.mode !== 'playing') return;
    ttsState.idx++;
    ttsSpeakCurrent();
  };
  u.onend = advance;
  u.onerror = advance;
  speechSynthesis.speak(u);
}

function ttsStart(context) {
  if (!ttsSupported()) return;
  speechSynthesis.cancel();
  const segs = ttsSegments(context);
  if (!segs.length) return;
  ttsState.queue = segs;
  ttsState.idx = 0;
  ttsState.mode = 'playing';
  ttsState.context = context;
  clearInterval(ttsState.keepAlive);
  // Chrome silently halts synthesis that runs longer than ~15s; a periodic resume keeps it alive.
  ttsState.keepAlive = setInterval(() => {
    if (ttsState.mode === 'playing') speechSynthesis.resume();
  }, 8000);
  ttsSpeakCurrent();
  ttsSyncUI();
}

function ttsPause() {
  if (ttsState.mode !== 'playing') return;
  ttsState.mode = 'paused';
  speechSynthesis.pause();
  ttsSyncUI();
}

function ttsResume() {
  if (ttsState.mode !== 'paused') return;
  ttsState.mode = 'playing';
  speechSynthesis.resume();
  ttsSyncUI();
}

function ttsStop() {
  if (!ttsSupported()) return;
  ttsState.mode = 'idle';
  ttsState.queue = [];
  ttsState.idx = 0;
  ttsState.context = null;
  clearInterval(ttsState.keepAlive);
  speechSynthesis.cancel();
  ttsClearHighlight();
  ttsSyncUI();
}

function ttsSyncUI() {
  const playing = ttsState.mode === 'playing';
  const paused = ttsState.mode === 'paused';
  const active = playing || paused;

  el('ra-toggle-label').textContent = !active ? 'Read aloud' : playing ? 'Pause' : 'Resume';
  el('ra-toggle').setAttribute('aria-pressed', active && ttsState.context === 'lesson' ? 'true' : 'false');
  el('ra-stop').hidden = !(active && ttsState.context === 'lesson');

  el('raq-toggle-label').textContent = !active ? 'Read this question aloud' : playing ? 'Pause' : 'Resume';
  el('raq-toggle').setAttribute('aria-pressed', active && ttsState.context === 'quiz' ? 'true' : 'false');
  el('raq-stop').hidden = !(active && ttsState.context === 'quiz');
}

function ttsToggle(context) {
  if (!ttsSupported()) return;
  if (ttsState.mode === 'idle' || ttsState.context !== context) {
    ttsStop();
    ttsStart(context);
    return;
  }
  if (ttsState.mode === 'playing') ttsPause();
  else ttsResume();
}

if (!ttsSupported()) {
  el('ra-note').hidden = false;
  el('ra-note').textContent = 'Read aloud is not available in this browser.';
  el('ra-toggle').disabled = true;
  el('raq-toggle').disabled = true;
} else {
  pickVoice();
  speechSynthesis.addEventListener('voiceschanged', pickVoice);
  el('ra-toggle').addEventListener('click', () => ttsToggle('lesson'));
  el('ra-stop').addEventListener('click', ttsStop);
  el('raq-toggle').addEventListener('click', () => ttsToggle('quiz'));
  el('raq-stop').addEventListener('click', ttsStop);
  el('ra-speed').addEventListener('change', () => {
    if (ttsState.mode === 'idle') return;
    const context = ttsState.context;
    const resumeAt = ttsState.idx;
    ttsStop();
    ttsStart(context);
    if (ttsState.mode === 'playing' && resumeAt < ttsState.queue.length) {
      speechSynthesis.cancel();
      ttsState.idx = resumeAt;
      ttsSpeakCurrent();
    }
  });
  window.addEventListener('beforeunload', () => speechSynthesis.cancel());
}
