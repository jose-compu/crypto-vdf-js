// Copyright 2025 VDF-JS Contributors
// Licensed under the Apache License, Version 2.0.

/**
 * Node.js worker_threads backend (issue #10).
 * Parallel batch verify and off-main-thread solve.
 */
import { Worker } from 'worker_threads';
import * as path from 'path';
import type { WorkerRequest, WorkerResponse } from './worker-protocol';
import { bytesToHex, hexToBytes } from './worker-protocol';
import type { VdfScheme, VdfBitSize } from './facade';

export interface CreateNodeVdfWorkerOptions {
  scheme?: VdfScheme;
  bits?: VdfBitSize;
  /** Override worker script path (defaults to dist/node-worker-thread.js). */
  workerPath?: string;
}

export interface NodeVdfWorkerHandle {
  readonly scheme: VdfScheme;
  readonly bits: VdfBitSize;
  solve(challenge: Uint8Array, difficulty: number): Promise<Uint8Array>;
  verify(challenge: Uint8Array, difficulty: number, proof: Uint8Array): Promise<void>;
  /**
   * Verify many proofs in parallel using a pool of workers.
   * Pool size defaults to min(items, CPU count).
   */
  verifyBatch(
    items: Array<{
      challenge: Uint8Array;
      difficulty: number;
      proof: Uint8Array;
    }>,
    poolSize?: number
  ): Promise<void>;
  terminate(): void;
}

function defaultWorkerPath(): string {
  // Compiled next to this file under dist/
  return path.join(__dirname, 'node-worker-thread.js');
}

class NodeWorkerClient {
  private worker: Worker;
  private nextId = 1;
  private pending = new Map<
    number,
    { resolve: (v: WorkerResponse) => void; reject: (e: Error) => void }
  >();

  constructor(workerPath: string) {
    this.worker = new Worker(workerPath);
    this.worker.on('message', (res: WorkerResponse) => {
      const p = this.pending.get(res.id);
      if (!p) return;
      this.pending.delete(res.id);
      p.resolve(res);
    });
    this.worker.on('error', (err) => {
      for (const [, p] of this.pending) p.reject(err);
      this.pending.clear();
    });
  }

  call(req: WorkerRequest): Promise<WorkerResponse> {
    return new Promise((resolve, reject) => {
      this.pending.set(req.id, { resolve, reject });
      this.worker.postMessage(req);
    });
  }

  nextRequestId(): number {
    return this.nextId++;
  }

  terminate(): void {
    void this.worker.terminate();
    this.pending.clear();
  }
}

/**
 * Create a Node worker_threads client for non-blocking solve/verify.
 */
export function createNodeVdfWorker(
  options: CreateNodeVdfWorkerOptions = {}
): NodeVdfWorkerHandle {
  const scheme: VdfScheme = options.scheme ?? 'wesolowski';
  const bits: VdfBitSize = options.bits ?? 256;
  const workerPath = options.workerPath ?? defaultWorkerPath();
  const client = new NodeWorkerClient(workerPath);

  return {
    scheme,
    bits,
    async solve(challenge: Uint8Array, difficulty: number): Promise<Uint8Array> {
      const res = await client.call({
        id: client.nextRequestId(),
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
      const res = await client.call({
        id: client.nextRequestId(),
        type: 'verify',
        scheme,
        bits,
        challengeHex: bytesToHex(challenge),
        difficulty,
        proofHex: bytesToHex(proof),
      });
      if (!res.ok) throw new Error(res.error);
    },
    async verifyBatch(items, poolSize): Promise<void> {
      const os = await import('os');
      const cpu = os.cpus().length || 2;
      const n = Math.max(1, Math.min(items.length, poolSize ?? cpu));
      const pool = Array.from({ length: n }, () => new NodeWorkerClient(workerPath));
      try {
        let i = 0;
        await Promise.all(
          pool.map(async (c) => {
            while (i < items.length) {
              const idx = i++;
              const it = items[idx];
              const res = await c.call({
                id: c.nextRequestId(),
                type: 'verify',
                scheme,
                bits,
                challengeHex: bytesToHex(it.challenge),
                difficulty: it.difficulty,
                proofHex: bytesToHex(it.proof),
              });
              if (!res.ok) throw new Error(res.error);
            }
          })
        );
      } finally {
        for (const c of pool) c.terminate();
      }
    },
    terminate(): void {
      client.terminate();
    },
  };
}
