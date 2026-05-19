#!/usr/bin/env node
/**
 * Slow golden-vector determinism checks (solve must match fixture).
 * Not run in Jest — use: npm run test:golden
 */
const fs = require('fs');
const path = require('path');
const vdf = require('../../dist/index.js');
const { withHeartbeat, logCaseProgress, log, elapsedMs } = require('./verbose');

const fixturePath = path.join(__dirname, '../fixtures/golden-vectors.json');
const data = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));

function hexToBytes(hex) {
  return new Uint8Array(Buffer.from(hex, 'hex'));
}

async function run() {
  const start = Date.now();
  const vectors = data.vectors;
  log(`Golden determinism: ${vectors.length} vector(s)`, { force: true });

  let passed = 0;
  let failed = 0;

  for (let i = 0; i < vectors.length; i++) {
    const vector = vectors[i];
    logCaseProgress(i + 1, vectors.length, `${vector.id} solve`);

    const challenge = hexToBytes(vector.challenge);
    const expected = hexToBytes(vector.proof);
    const discriminant = BigInt(vector.discriminant);
    const Params =
      vector.scheme === 'wesolowski' ? vdf.WesolowskiVDFParams : vdf.PietrzakVDFParams;
    const inst = new Params(vector.bits).new();

    try {
      const proof = await withHeartbeat(
        inst.solve(challenge, vector.difficulty, discriminant),
        `${vector.id} solve`
      );
      if (Buffer.compare(Buffer.from(proof), Buffer.from(expected)) === 0) {
        console.log(`  ✓ ${vector.id}`);
        passed++;
      } else {
        console.error(`  ✗ ${vector.id}: proof mismatch`);
        failed++;
      }
    } catch (e) {
      console.error(`  ✗ ${vector.id}: ${e.message}`);
      failed++;
    }
  }

  log(`Done in ${elapsedMs(start)} — passed ${passed}/${vectors.length}`, { force: true });
  process.exit(failed > 0 ? 1 : 0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
