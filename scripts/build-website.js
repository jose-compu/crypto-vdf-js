#!/usr/bin/env node
/**
 * Build static site for GitHub Pages: website/ + TypeDoc API → site/
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.join(__dirname, '..');
const websiteSrc = path.join(root, 'website');
const siteOut = path.join(root, 'site');

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const ent of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, ent.name);
    const d = path.join(dest, ent.name);
    if (ent.isDirectory()) {
      copyDir(s, d);
    } else {
      fs.copyFileSync(s, d);
    }
  }
}

console.log('Building GitHub Pages site…');
fs.rmSync(siteOut, { recursive: true, force: true });
fs.mkdirSync(siteOut, { recursive: true });

console.log('  copy website/');
copyDir(websiteSrc, siteOut);

console.log('  typedoc → site/api/');
execSync('npx typedoc --options typedoc.json --out site/api', {
  cwd: root,
  stdio: 'inherit',
});

console.log('Done:', siteOut);
