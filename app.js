/* ================================================================
   Knowledge Garden — app.js
   ================================================================ */

// ── State ─────────────────────────────────────────────────────
let manifest       = null;
let currentModule  = 'notes';
let currentNotePath = null;
let skillTreeRendered = false;

// D3 color palette per top-level category
const PALETTE = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#84cc16', // lime
];

// ── Bootstrap ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  mermaid.initialize({ startOnLoad: false, theme: 'default' });
  await loadManifest();
  setupEvents();
  handleRoute();
  window.addEventListener('hashchange', handleRoute);
});

// ── Manifest ──────────────────────────────────────────────────
async function loadManifest() {
  try {
    const res = await fetch('notes-manifest.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    manifest = await res.json();
    renderNoteTree(manifest.tree);
  } catch (err) {
    document.getElementById('note-tree').innerHTML =
      `<div class="tree-error">
        Could not load <code>notes-manifest.json</code>.<br>
        Run <code>node build.js</code> to generate it.
      </div>`;
    console.error('Manifest load error:', err);
  }
}

// ── Routing ───────────────────────────────────────────────────
function handleRoute() {
  const hash = window.location.hash;

  if (!hash || hash === '#') {
    activateModule('notes', false);
    return;
  }
  if (hash === '#skill-tree') {
    activateModule('skill-tree', false);
    return;
  }
  if (hash.startsWith('#note/')) {
    const path = hash.slice(6); // strip '#note/'
    activateModule('notes', false);
    openNote(path);
  }
}

function navigate(hash) {
  history.pushState(null, '', hash || '#');
}

// ── Module switching ──────────────────────────────────────────
function activateModule(name, pushHash = true) {
  currentModule = name;

  // Highlight active module button
  document.querySelectorAll('.module-btn').forEach(btn =>
    btn.classList.toggle('active', btn.dataset.module === name)
  );

  // Show/hide views
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(`${name}-view`).classList.add('active');

  // Show/hide side panel
  const panel = document.getElementById('side-panel');
  const app   = document.getElementById('app');
  if (name === 'notes') {
    panel.classList.remove('hidden');
    app.classList.remove('panel-hidden');
  } else {
    panel.classList.add('hidden');
    app.classList.add('panel-hidden');
  }

  // Lazy-render skill tree
  if (name === 'skill-tree') {
    if (pushHash) navigate('#skill-tree');
    if (manifest && !skillTreeRendered) {
      renderSkillTree(manifest.tree);
      skillTreeRendered = true;
    }
  } else if (name === 'notes') {
    if (pushHash && !currentNotePath) navigate('#');
  }
}

// ── Note Tree ─────────────────────────────────────────────────
function renderNoteTree(tree) {
  const container = document.getElementById('note-tree');
  container.innerHTML = '';

  const hasCats  = tree.children?.length > 0;
  const hasNotes = tree.notes?.length   > 0;

  if (!hasCats && !hasNotes) {
    container.innerHTML =
      '<div class="tree-empty">No notes found.<br>Add <code>.md</code> files to <code>notes/</code> and run <code>node build.js</code>.</div>';
    return;
  }

  // Root-level notes (unusual but supported)
  if (hasNotes) {
    for (const note of tree.notes) container.appendChild(noteItem(note, 12));
  }

  // Categories
  if (hasCats) {
    for (const cat of tree.children) container.appendChild(categoryNode(cat, 0));
  }
}

function categoryNode(node, depth) {
  const indent = depth * 14 + 12;
  const wrapper  = document.createElement('div');

  // Header row
  const header = document.createElement('div');
  header.className = 'tree-category-header';
  header.style.paddingLeft = `${indent}px`;

  const arrow = document.createElement('span');
  arrow.className = 'tree-arrow open';
  arrow.innerHTML =
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
       <polyline points="9 18 15 12 9 6"/>
     </svg>`;

  const folderIco = document.createElement('span');
  folderIco.className = 'tree-icon folder-icon';
  folderIco.innerHTML =
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
       <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
     </svg>`;

  const label = document.createElement('span');
  label.className = 'tree-category-label';
  label.textContent = node.name;

  header.appendChild(arrow);
  header.appendChild(folderIco);
  header.appendChild(label);

  // Children
  const children = document.createElement('div');
  children.className = 'tree-children open';

  for (const child of (node.children || [])) {
    children.appendChild(categoryNode(child, depth + 1));
  }

  for (const note of (node.notes || [])) {
    children.appendChild(noteItem(note, indent + 28));
  }

  // Toggle
  header.addEventListener('click', () => {
    const open = children.classList.toggle('open');
    arrow.classList.toggle('open', open);
  });

  wrapper.appendChild(header);
  wrapper.appendChild(children);
  return wrapper;
}

function noteItem(note, indentPx) {
  const item = document.createElement('div');
  item.className = 'tree-note';
  item.dataset.path = note.path;
  item.style.paddingLeft = `${indentPx}px`;

  const fileIco = document.createElement('span');
  fileIco.className = 'tree-icon file-icon';
  fileIco.innerHTML =
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
       <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
       <polyline points="14 2 14 8 20 8"/>
     </svg>`;

  const label = document.createElement('span');
  label.className = 'tree-note-label';
  label.textContent = humanize(note.title);

  item.appendChild(fileIco);
  item.appendChild(label);

  item.addEventListener('click', () => {
    navigate(`#note/${note.path}`);
    openNote(note.path);
  });

  return item;
}

// ── Note Loading ──────────────────────────────────────────────
async function openNote(rawPath) {
  // Normalize: decode any percent-encoded characters from the URL hash
  const path = decodeURIComponent(rawPath);

  // Guard against re-fetching the same note
  if (path === currentNotePath) return;
  currentNotePath = path;

  // Highlight in tree
  document.querySelectorAll('.tree-note').forEach(el =>
    el.classList.toggle('active', el.dataset.path === path)
  );

  // Switch to note layout
  const welcome  = document.getElementById('welcome-state');
  const article  = document.getElementById('note-content');
  const body     = document.getElementById('note-body');
  const titleEl  = document.getElementById('note-title');
  const crumbEl  = document.getElementById('note-breadcrumb');

  welcome.classList.add('hidden');
  article.classList.remove('hidden');
  body.innerHTML = '<div class="tree-loading" style="padding:24px 0"><div class="spinner"></div><span>Loading…</span></div>';

  try {
    const res = await fetch(encodeURI(path));
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const md = await res.text();

    // Render markdown
    const html = marked.parse(md);
    body.innerHTML = html;

    // Syntax highlight code blocks
    body.querySelectorAll('pre code').forEach(block => hljs.highlightElement(block));

    // Build TOC from headings
    renderTOC(body);
    showTOC();

    // Breadcrumb + title from path: notes/Cat/Sub/file.md
    const parts = path.replace(/^notes\//, '').replace(/\.md$/, '').split('/');
    const cats  = parts.slice(0, -1);
    const name  = parts[parts.length - 1];

    titleEl.textContent = humanize(name);

    crumbEl.innerHTML = cats.map(c =>
      `<span class="breadcrumb-item">${c}</span>`
    ).join('<span class="breadcrumb-sep"> / </span>');

    // Scroll to top
    article.scrollTop = 0;

  } catch (err) {
    body.innerHTML = `<div class="note-load-error">Failed to load note: ${err.message}</div>`;
    console.error('Note load error:', err);
  }
}

function humanize(str) {
  return str.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

// ── Table of Contents ─────────────────────────────────────
function renderTOC(body) {
  const tocNav = document.getElementById('toc-nav');
  tocNav.innerHTML = '';
  const headings = body.querySelectorAll('h1, h2, h3, h4');

  if (headings.length === 0) {
    tocNav.innerHTML = '<div class="toc-empty">No headings in this note.</div>';
    return;
  }

  headings.forEach((h, i) => {
    h.id = `toc-target-${i}`;
    const a = document.createElement('a');
    a.className = `toc-item toc-${h.tagName.toLowerCase()}`;
    a.href = `#toc-target-${i}`;
    a.textContent = h.textContent;
    a.addEventListener('click', e => {
      e.preventDefault();
      h.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    tocNav.appendChild(a);
  });

  // Scroll-spy: highlight active heading
  const article = document.getElementById('note-content');
  article.addEventListener('scroll', () => updateActiveTOCItem(headings), { passive: true });
}

function updateActiveTOCItem(headings) {
  const article = document.getElementById('note-content');
  const scrollTop = article.scrollTop;
  const offset = 40;
  let activeIdx = 0;

  headings.forEach((h, i) => {
    if (h.offsetTop - offset <= scrollTop) activeIdx = i;
  });

  document.querySelectorAll('#toc-nav .toc-item').forEach((a, i) => {
    a.classList.toggle('active', i === activeIdx);
  });
}

function showTOC() {
  document.getElementById('note-tree').classList.add('hidden');
  document.getElementById('note-toc').classList.remove('hidden');
  document.getElementById('panel-title').textContent = 'ON THIS PAGE';
}

function showNoteTree() {
  document.getElementById('note-toc').classList.add('hidden');
  document.getElementById('note-tree').classList.remove('hidden');
  document.getElementById('panel-title').textContent = 'Notes';
}

// ── Skill Tree (Mermaid) ───────────────────────────────────────
async function renderSkillTree(tree) {
  const container = document.getElementById('skill-tree-container');
  container.innerHTML = '<p style="color:rgba(255,255,255,.4);padding:40px">Rendering…</p>';

  // Build mermaid graph definition
  let def = 'graph TD\n';
  let counter = 0;
  const ids = {};
  const getId = label => {
    if (!ids[label]) ids[label] = 'N' + counter++;
    return ids[label];
  };

  const walk = (node, parentId) => {
    const label = node.name === 'root' ? 'Knowledge Base' : node.name;
    const id = getId(label);
    def += parentId
      ? `  ${parentId} --> ${id}["${label}"]\n`
      : `  ${id}["${label}"]\n`;
    for (const child of (node.children || [])) walk(child, id);
  };
  walk(tree, null);

  try {
    const { svg } = await mermaid.render('st' + Date.now(), def);
    container.innerHTML = svg;
    const svgEl = container.querySelector('svg');
    if (svgEl) {
      svgEl.style.width  = '100%';
      svgEl.style.height = 'auto';
    }
  } catch (err) {
    container.innerHTML = `<p style="color:#ef4444;padding:40px">Error: ${err.message}</p>`;
    console.error('Mermaid error:', err);
  }

  // Legend
  const topCats = tree.children || [];
  const legend = document.getElementById('st-legend');
  legend.innerHTML = '';
  topCats.forEach((cat, i) => {
    const item = document.createElement('div');
    item.className = 'st-legend-item';
    item.innerHTML =
      `<div class="st-legend-dot" style="background:${PALETTE[i % PALETTE.length]}"></div>
       <span>${cat.name}</span>`;
    legend.appendChild(item);
  });
}

// ── Events ────────────────────────────────────────────────────
function setupEvents() {
  // Module buttons
  document.querySelectorAll('.module-btn').forEach(btn => {
    btn.addEventListener('click', () => activateModule(btn.dataset.module));
  });

  // TOC back button
  document.getElementById('toc-back-btn').addEventListener('click', showNoteTree);

  // Collapse side panel toggle
  document.getElementById('collapse-btn').addEventListener('click', () => {
    const panel = document.getElementById('side-panel');
    const app   = document.getElementById('app');
    panel.classList.toggle('hidden');
    app.classList.toggle('panel-hidden');
  });

}
