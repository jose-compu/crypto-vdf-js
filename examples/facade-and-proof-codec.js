/**
 * v1.3 example: createVdf facade + proof encode/decode.
 * Run: npm run build:node && node examples/facade-and-proof-codec.js
 */
const {
  createVdf,
  encodeProof,
  decodeProof,
  estimateDifficulty,
} = require('../dist/index.js');

async function main() {
  const vdf = createVdf({ scheme: 'wesolowski', bits: 256 });
  const challenge = new Uint8Array([0xaa, 0xbb, 0xcc]);
  const difficulty = estimateDifficulty({ bits: 256, targetSeconds: 0.05 });

  console.log(`scheme=${vdf.scheme} bits=${vdf.bits} difficulty=${difficulty}`);

  const proof = await vdf.solve(challenge, difficulty);
  vdf.verify(challenge, difficulty, proof);

  const hex = encodeProof(proof, 'hex');
  const b64 = encodeProof(proof, 'base64');
  const json = encodeProof(proof, 'json');

  vdf.verify(challenge, difficulty, decodeProof(hex, 'hex'));
  vdf.verify(challenge, difficulty, decodeProof(b64, 'base64'));
  vdf.verify(challenge, difficulty, decodeProof(json, 'json'));

  console.log('✓ facade solve/verify + hex/base64/json round-trips OK');
  console.log('  hex length:', hex.length);
  console.log('  json:', json.slice(0, 80) + '…');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
