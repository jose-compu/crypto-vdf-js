// Copyright 2025 VDF-JS Contributors
// Licensed under the Apache License, Version 2.0.

import type { WorkerRequest, WorkerResponse } from './worker-protocol';
import { bytesToHex, hexToBytes } from './worker-protocol';
import type { VdfScheme, VdfBitSize } from './facade';

export interface CreateVdfWorkerOptions {
  /**
   * Worker script URL (browser). Required in browsers.
   * Example: `new URL('./browser-worker.js', import.meta.url)` after bundling.
   */
  workerUrl?: string | URL;
  /** Default scheme. */
  scheme?: VdfScheme;
  /** Default bit size. */
  bits?: VdfBitSize;
}

export interface VdfWorkerHandle {
  readonly scheme: VdfScheme;
  readonly bits: VdfBitSize;
  solve(challenge: Uint8Array, difficulty: number): Promise<Uint8Array>;
  verify(challenge: Uint8Array, difficulty: number, proof: Uint8Array): Promise<void>;
  terminate(): void;
}

/**
 * Browser-oriented client that runs solve/verify in a Web Worker (issue #9).
 * Pass `workerUrl` pointing at the bundled `browser-worker` entry.
 */
export function createVdfWorker(options: CreateVdfWorkerOptions = {}): VdfWorkerHandle {
  const scheme: VdfScheme = options.scheme ?? 'wesolowski';
  const bits: VdfBitSize = options.bits ?? 256;

  if (typeof Worker === 'undefined') {
    throw new Error(
      'Web Worker is not available in this environment. Use createNodeVdfWorker in Node.js.'
    );
  }
  if (options.workerUrl == null) {
    throw new Error('createVdfWorker requires options.workerUrl in the browser.');
  }

  const worker = new Worker(options.workerUrl, { type: 'module' });
  let nextId = 1;
  const pending = new Map<
    number,
    { resolve: (v: WorkerResponse) => void; reject: (e: Error) => void }
  >();

  worker.onmessage = (ev: MessageEvent<WorkerResponse>) => {
    const res = ev.data;
    const p = pending.get(res.id);
    if (!p) return;
    pending.delete(res.id);
    p.resolve(res);
  };
  worker.onerror = (ev) => {
    for (const [, p] of pending) p.reject(new Error(ev.message || 'Worker error'));
    pending.clear();
  };

  function call(req: WorkerRequest): Promise<WorkerResponse> {
    return new Promise((resolve, reject) => {
      pending.set(req.id, { resolve, reject });
      worker.postMessage(req);
    });
  }

  return {
    scheme,
    bits,
    async solve(challenge: Uint8Array, difficulty: number): Promise<Uint8Array> {
      const res = await call({
        id: nextId++,
        type: 'solve',
        scheme,
        bits,
        challengeHex: bytesToHex(challenge),
        difficulty,
      });
      if (!res.ok) throw new Error(res.error);
      if (res.type !== 'solve') throw new Error('Unexpected worker response');
      return hexToBytes(res.proofHex);
    },
    async verify(
      challenge: Uint8Array,
      difficulty: number,
      proof: Uint8Array
    ): Promise<void> {
      const res = await call({
        id: nextId++,
        type: 'verify',
        scheme,
        bits,
        challengeHex: bytesToHex(challenge),
        difficulty,
        proofHex: bytesToHex(proof),
      });
      if (!res.ok) throw new Error(res.error);
    },
    terminate(): void {
      worker.terminate();
      pending.clear();
    },
  };
}
