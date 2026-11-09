# Examples

Quick map of demos under `examples/`. Prefer **Wesolowski** for production or difficulty &gt; 7000; **Pietrzak** is fine for learning and moderate difficulties (even, 66–7000).

| File | Scheme(s) | Runtime | Notes |
|------|-----------|---------|--------|
| [`node-basic.ts`](./node-basic.ts) | Wesolowski | Node / TS | Smallest teaching path: discriminant → solve → verify (+ `SolveOptions`) |
| [`node-example.js`](./node-example.js) | Pietrzak + Wesolowski | Node CJS | Side-by-side solve/verify with precomputed 256-bit discriminant |
| [`facade-and-proof-codec.js`](./facade-and-proof-codec.js) | via `createVdf` | Node CJS | High-level facade + hex/base64/JSON proof codecs |
| [`browser.html`](./browser.html) / [`browser-example.html`](./browser-example.html) | both (bundle) | Browser | UMD bundle usage |
| [`test-readme-nodejs.js`](./test-readme-nodejs.js) | both | Node | Guards README snippets |
| [`test-readme-browser.html`](./test-readme-browser.html) | both | Browser | README browser snippets |
| [`README-TESTING.md`](./README-TESTING.md) | — | — | How example/README tests are run |

## Run commands

From the repo root (after `npm run build:node`):

```bash
# Teaching example (TypeScript against src/)
npx --yes ts-node --transpile-only examples/node-basic.ts

# CommonJS demos against dist/
node examples/node-example.js
node examples/facade-and-proof-codec.js
node examples/test-readme-nodejs.js
```

Open the HTML files in a browser after `npm run build:browser` (bundle at `dist/browser/vdf.min.js`).

## Pietrzak vs Wesolowski (one line)

- **Pietrzak** — longer proofs, even difficulty in `[66, 7000]` in this JS port.
- **Wesolowski** — shorter proofs, no difficulty ceiling here; default recommendation.

## Requirements

- Node.js 18+ for Node examples
- Modern browser for HTML demos
- Built distribution (`npm run build` or at least `npm run build:node`)
