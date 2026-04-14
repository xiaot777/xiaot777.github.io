#!/usr/bin/env node
/**
 * build.js — scan the notes/ directory and generate notes-manifest.json
 *
 * Usage:
 *   node build.js
 *
 * Run this every time you add, rename, or remove a note file.
 * The manifest is required by the web app to discover notes.
 */

const fs   = require('fs');
const path = require('path');

const NOTES_DIR    = path.join(__dirname, 'notes');
const MANIFEST_OUT = path.join(__dirname, 'notes-manifest.json');

function buildTree(dir, relativePath = '') {
  const name = relativePath ? path.basename(dir) : 'root';
  const node = { name, children: [], notes: [] };

  if (!fs.existsSync(dir)) {
    console.warn(`[warn] notes/ directory not found: ${dir}`);
    return node;
  }

  const entries = fs.readdirSync(dir).sort();

  for (const entry of entries) {
    // Skip hidden files / dotfiles
    if (entry.startsWith('.')) continue;

    const abs  = path.join(dir, entry);
    const rel  = relativePath ? `${relativePath}/${entry}` : entry;
    const stat = fs.statSync(abs);

    if (stat.isDirectory()) {
      node.children.push(buildTree(abs, rel));
    } else if (entry.toLowerCase().endsWith('.md')) {
      const title = entry.slice(0, -3); // strip .md
      node.notes.push({
        title,
        path: `notes/${rel}`,
        slug: rel.replace(/\//g, '-').slice(0, -3),
      });
    }
  }

  return node;
}

function main() {
  console.log('Building notes manifest…');

  const tree = buildTree(NOTES_DIR);

  // Count stats
  let cats = 0, notes = 0;
  function count(node) {
    cats  += node.children.length;
    notes += node.notes.length;
    node.children.forEach(count);
  }
  count(tree);

  const manifest = {
    generated: new Date().toISOString(),
    stats: { categories: cats, notes },
    tree,
  };

  fs.writeFileSync(MANIFEST_OUT, JSON.stringify(manifest, null, 2) + '\n');
  console.log(`✓ notes-manifest.json — ${cats} categories, ${notes} notes`);
}

main();
