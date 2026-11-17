#!/usr/bin/env node
/**
 * Generate DISCRIMINANT_4096 via the C/OpenSSL helper (fast native Miller–Rabin).
 * Falls back to pure-JS createDiscriminant only if the C binary cannot be built.
 *
 *   npm run generate:4096
 *
 * Writes decimal D to stdout; stderr shows progress. Preferred for regeneration:
 * compile scripts/generate-precomputed-4096.c against OpenSSL 3.
 */
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const root = path.join(__dirname, '..');
const cSrc = path.join(__dirname, 'generate-precomputed-4096.c');
const bin = path.join(os.tmpdir(), 'crypto-vdf-gen4096');

function opensslPrefix() {
  for (const p of [
    '/opt/homebrew/opt/openssl@3',
    '/usr/local/opt/openssl@3',
    '/opt/homebrew/opt/openssl',
    '/usr/local/opt/openssl',
  ]) {
    if (fs.existsSync(path.join(p, 'include/openssl/bn.h'))) return p;
  }
  const brew = spawnSync('brew', ['--prefix', 'openssl@3'], { encoding: 'utf8' });
  if (brew.status === 0) {
    const p = brew.stdout.trim();
    if (p && fs.existsSync(path.join(p, 'include/openssl/bn.h'))) return p;
  }
  return null;
}

function buildC() {
  const openssl = opensslPrefix();
  if (!openssl) {
    console.error('OpenSSL 3 headers not found; cannot build C generator.');
    return false;
  }
  const args = [
    '-O3',
    '-o',
    bin,
    cSrc,
    `-I${openssl}/include`,
    `-L${openssl}/lib`,
    '-lcrypto',
  ];
  console.error(`cc ${args.join(' ')}`);
  const r = spawnSync('cc', args, { encoding: 'utf8' });
  if (r.status !== 0) {
    console.error(r.stderr || r.stdout);
    return false;
  }
  return true;
}

function runC() {
  const r = spawnSync(bin, [], { encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 });
  if (r.stderr) process.stderr.write(r.stderr);
  if (r.status !== 0) {
    console.error('C generator failed');
    process.exit(r.status || 1);
  }
  const d = (r.stdout || '').trim();
  if (!/^-?\d+$/.test(d)) {
    console.error('Unexpected C generator output');
    process.exit(1);
  }
  console.log(d);
  console.error('\n// Paste into src/precomputed-discriminants.ts:');
  console.error(`export const DISCRIMINANT_4096 = ${d}n;`);
}

function runJsFallback() {
  console.error('Falling back to slow pure-JS createDiscriminant…');
  const { createDiscriminant } = require('../dist/discriminant');
  const { bitLength, isProbablePrime } = require('../dist/utils');
  const seed = new Uint8Array([0xc0, 0xde, 0x40, 0x96]);
  const t0 = Date.now();
  const d = createDiscriminant(seed, 4096);
  const abs = -d;
  console.error(`Elapsed ${(Date.now() - t0) / 1000}s bits=${bitLength(abs)} mod8=${abs % 8n} prime=${isProbablePrime(abs, 16)}`);
  console.log(d.toString());
}

if (buildC()) {
  runC();
} else {
  runJsFallback();
}
