// Copyright 2025 VDF-JS Contributors
// Licensed under the Apache License, Version 2.0.

import * as path from 'path';
import { createVdf } from '../src/facade';
import { createNodeVdfWorker } from '../src/node-worker';
// Uses compiled worker thread script under dist/
import {
  loadPrecomputedDiscriminant,
  clearDiscriminantCache,
} from '../src/lazy-discriminants';
import { DISCRIMINANT_256 } from '../src/precomputed-discriminants';

describe('lazy discriminants', () => {
  afterEach(() => clearDiscriminantCache());

  it('loads 256-bit precomputed discriminant', async () => {
    const d = await loadPrecomputedDiscriminant(256);
    expect(d).toBe(DISCRIMINANT_256);
  });
});

describe('Node worker_threads VDF', () => {
  const workerPath = path.join(__dirname, '../dist/node-worker-thread.js');
  const challenge = new Uint8Array([0xaa, 0xbb, 0xcc]);
  const difficulty = 66;

  it('solve + verify off main thread', async () => {
    const w = createNodeVdfWorker({
      scheme: 'wesolowski',
      bits: 256,
      workerPath,
    });
    try {
      const proof = await w.solve(challenge, difficulty);
      await w.verify(challenge, difficulty, proof);
      // cross-check main thread
      const main = createVdf({ scheme: 'wesolowski', bits: 256 });
      main.verify(challenge, difficulty, proof);
    } finally {
      w.terminate();
    }
  }, 60000);

  it('verifyBatch accepts multiple proofs', async () => {
    const main = createVdf({ scheme: 'wesolowski', bits: 256 });
    const p1 = await main.solve(challenge, difficulty);
    const p2 = await main.solve(new Uint8Array([1, 2, 3, 4]), difficulty);

    const w = createNodeVdfWorker({
      scheme: 'wesolowski',
      bits: 256,
      workerPath,
    });
    try {
      await w.verifyBatch(
        [
          { challenge, difficulty, proof: p1 },
          { challenge: new Uint8Array([1, 2, 3, 4]), difficulty, proof: p2 },
        ],
        2
      );
    } finally {
      w.terminate();
    }
  }, 60000);
});
