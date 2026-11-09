# Browser Web Worker (issue #9)

`createVdfWorker()` runs `solve` / `verify` off the main thread so UIs stay responsive.

## Bundle the worker entry

Point webpack (or your bundler) at `src/browser-worker.ts` as a separate entry, e.g. `vdf.worker.js`, then:

```js
import { createVdfWorker } from 'crypto-vdf';

const vdf = createVdfWorker({
  scheme: 'wesolowski',
  bits: 256,
  workerUrl: new URL('./vdf.worker.js', import.meta.url),
});

const challenge = new Uint8Array([1, 2, 3, 4]);
const proof = await vdf.solve(challenge, 100);
await vdf.verify(challenge, 100, proof);
vdf.terminate();
```

The worker message protocol lives in `src/worker-protocol.ts` (hex-encoded challenge/proof).

For Node.js, use `createNodeVdfWorker` instead (see `examples/node-worker-example.js`).
