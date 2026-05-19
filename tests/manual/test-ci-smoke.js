#!/usr/bin/env node
/**
 * Minimal post-build smoke test for CI (~100ms).
 * One Wesolowski verify using a fixed proof (no solve).
 */
const fs = require('fs');
const path = require('path');
const vdf = require('../../dist/index.js');

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
