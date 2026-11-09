// Node.js Example - Verifiable Delay Function (VDF)
// Always pass a precomputed discriminant on the low-level API.
const {
  PietrzakVDFParams,
  WesolowskiVDFParams,
  DISCRIMINANT_256,
} = require('../dist/index');

async function main() {
  console.log('VDF Example - Node.js\n');

  const challenge = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
  const difficulty = 100; // iterations (Pietrzak: even, 66–7000)
  const disc = DISCRIMINANT_256;

  console.log('1. Pietrzak VDF (256-bit)');
  const pietrzak = new PietrzakVDFParams(256).new();

  console.log('   Solving...');
  const startP = Date.now();
  const proofP = await pietrzak.solve(challenge, difficulty, disc);
  console.log(`   Solved in ${Date.now() - startP}ms`);

  console.log('   Verifying...');
  pietrzak.verify(challenge, difficulty, proofP, disc);
  console.log('   ✓ Proof verified!\n');

  console.log('2. Wesolowski VDF (256-bit)');
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

