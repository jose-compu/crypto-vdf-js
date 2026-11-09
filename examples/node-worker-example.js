/**
 * Node worker_threads example (milestone 1.8 / issue #10).
 *
 *   npm run build:node && node examples/node-worker-example.js
 */
const path = require('path');
const { createVdf } = require('../dist/index.js');
const { createNodeVdfWorker } = require('../dist/node-worker.js');

async function main() {
  const workerPath = path.join(__dirname, '../dist/node-worker-thread.js');
  const worker = createNodeVdfWorker({
    scheme: 'wesolowski',
    bits: 256,
    workerPath,
  });

  const challenge = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
  const difficulty = 66;

  console.log('Solving in worker_threads…');
  const proof = await worker.solve(challenge, difficulty);
  await worker.verify(challenge, difficulty, proof);
  console.log('Worker verify OK, proof bytes:', proof.length);

  // Batch verify
  const main = createVdf({ scheme: 'wesolowski', bits: 256 });
  const p2 = await main.solve(new Uint8Array([9, 9, 9]), difficulty);
  await worker.verifyBatch(
    [
      { challenge, difficulty, proof },
      { challenge: new Uint8Array([9, 9, 9]), difficulty, proof: p2 },
    ],
    2
  );
  console.log('Batch verify OK');
  worker.terminate();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
