#!/usr/bin/env node
/**
 * Minimal post-build smoke test for CI.
 * Fixed-proof verifies + 4096-bit low-difficulty solve.
 */
const fs = require('fs');
const path = require('path');
const vdf = require('../../dist/index.js');

async function main() {
  const fixture = path.join(__dirname, '../fixtures/golden-vectors.json');
  const data = JSON.parse(fs.readFileSync(fixture, 'utf8'));
  const vector = data.vectors.find((v) => v.scheme === 'wesolowski' && v.bits === 256);

  if (!vector) {
    console.error('smoke: no wesolowski-256 fixture');
    process.exit(1);
  }

  const challenge = Uint8Array.from(Buffer.from(vector.challenge, 'hex'));
  const proof = Uint8Array.from(Buffer.from(vector.proof, 'hex'));
  const discriminant = BigInt(vector.discriminant);

  const inst = new vdf.WesolowskiVDFParams(256).new();
  inst.verify(challenge, vector.difficulty, proof, discriminant);
  console.log('CI smoke: Wesolowski 256-bit verify OK');

  const v2048 = data.vectors.find((v) => v.scheme === 'wesolowski' && v.bits === 2048);
  if (v2048) {
    const ch = Uint8Array.from(Buffer.from(v2048.challenge, 'hex'));
    const pr = Uint8Array.from(Buffer.from(v2048.proof, 'hex'));
    const disc = BigInt(v2048.discriminant);
    new vdf.WesolowskiVDFParams(2048).new().verify(ch, v2048.difficulty, pr, disc);
    console.log('CI smoke: Wesolowski 2048-bit verify OK');
  }

  const d4096 = vdf.DISCRIMINANT_4096;
  if (!(d4096 < 0n) || (-d4096) % 8n !== 7n) {
    console.error('smoke: DISCRIMINANT_4096 property check failed');
    process.exit(1);
  }
  const handle = vdf.createVdf({ bits: 4096 });
  const ch = new Uint8Array([0xaa, 0xbb, 0xcc]);
  const p4096 = await handle.solve(ch, 8);
  handle.verify(ch, 8, p4096);
  console.log('CI smoke: Wesolowski 4096-bit solve/verify (d=8) OK');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
