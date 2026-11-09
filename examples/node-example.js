// Node.js Example - Verifiable Delay Function (VDF)
// Teaching example: setup → solve → verify for Pietrzak and Wesolowski.
//
// Always pass a precomputed discriminant on the low-level API.
// - challenge: arbitrary seed bytes (e.g. beacon input)
// - difficulty: sequential iteration count (controls delay; not seconds)
// - disc: precomputed class-group discriminant (fast, deterministic)
//
// Run from repo root after `npm run build:node`:
//   node examples/node-example.js
//
// Prefer createVdf() in apps; this file shows the low-level params API.
// See examples/README.md and examples/node-basic.ts for the smallest path.

const {
  PietrzakVDFParams,
  WesolowskiVDFParams,
  DISCRIMINANT_256,
} = require('../dist/index');

async function main() {
  console.log('VDF Example - Node.js\n');

  // 1) Challenge: any Uint8Array seed
  const challenge = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
  // 2) Difficulty: iterations (Pietrzak: even, 66–7000 in this JS port)
  const difficulty = 100;
  // 3) Discriminant: use DISCRIMINANT_* — never omit in production low-level calls
  const disc = DISCRIMINANT_256;

  console.log('1. Pietrzak VDF (256-bit)');
  // 4a) Build scheme instance from bit length matching the discriminant
  const pietrzak = new PietrzakVDFParams(256).new();

  console.log('   Solving...');
  const startP = Date.now();
  // 5a) solve(challenge, difficulty, discriminant) → proof bytes
  const proofP = await pietrzak.solve(challenge, difficulty, disc);
  console.log(`   Solved in ${Date.now() - startP}ms`);

  console.log('   Verifying...');
  // 6a) verify throws InvalidProof if the proof is wrong
  pietrzak.verify(challenge, difficulty, proofP, disc);
  console.log('   ✓ Proof verified!\n');

  console.log('2. Wesolowski VDF (256-bit)');
  // 4b) Wesolowski: preferred for production (smaller proofs, no 7000 cap)
  const wesolowski = new WesolowskiVDFParams(256).new();

  console.log('   Solving...');
  const startW = Date.now();
  const proofW = await wesolowski.solve(challenge, difficulty, disc);
  console.log(`   Solved in ${Date.now() - startW}ms`);

  console.log('   Verifying...');
  wesolowski.verify(challenge, difficulty, proofW, disc);
  console.log('   ✓ Proof verified!\n');

  console.log('Example completed successfully!');
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
