// Copyright 2025 VDF-JS Contributors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * Smallest teaching example: evaluate → verify with a precomputed discriminant.
 *
 * Run (after build): npx ts-node examples/node-basic.ts
 * Or compile against dist: node -r ts-node/register … / use the JS examples.
 *
 * Prefer createVdf() in apps; this file shows the low-level params API.
 */

import {
  WesolowskiVDFParams,
  DISCRIMINANT_256,
  InvalidProof,
  type SolveOptions,
} from '../src/index';

async function main() {
  console.log('VDF.js — basic evaluate → verify\n');

  // 1) Challenge: arbitrary bytes (e.g. block hash, beacon seed).
  const challenge = new Uint8Array([0xaa]);

  // 2) Difficulty: iteration count (not seconds). Keep small for a quick demo.
  //    Use estimateDifficulty() when you care about wall-clock delay.
  const difficulty = 66;

  // 3) Discriminant: always pass a precomputed value for the low-level API.
  //    Generating one in pure JS is extremely slow.
  const discriminant = DISCRIMINANT_256;

  // 4) Scheme: Wesolowski is recommended for production (no ≤7000 cap, smaller proofs).
  const vdf = new WesolowskiVDFParams(256).new();

  console.log(`challenge: ${Buffer.from(challenge).toString('hex')}`);
  console.log(`difficulty: ${difficulty} iterations`);
  console.log('solving…');

  // Optional v1.5+ SolveOptions: progress + cooperative cancel
  const options: SolveOptions = {
    onProgress: (completed, total) => {
      if (completed === total || completed % 10 === 0) {
        console.log(`  progress ${completed}/${total}`);
      }
    },
  };

  const start = Date.now();
  // Low-level solve(challenge, difficulty, discriminant, options?)
  const proof = await vdf.solve(challenge, difficulty, discriminant, options);
  console.log(`solved in ${Date.now() - start}ms, proof ${proof.length} bytes`);

  // 5) Verify is fast relative to solve
  console.log('verifying…');
  try {
    vdf.verify(challenge, difficulty, proof, discriminant);
    console.log('✓ proof verified');
  } catch (error) {
    if (error instanceof InvalidProof) {
      console.log('✗ verification failed');
      process.exitCode = 1;
      return;
    }
    throw error;
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
