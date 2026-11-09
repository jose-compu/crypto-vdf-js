// Copyright 2025 VDF-JS Contributors
// Licensed under the Apache License, Version 2.0.

/** Message protocol shared by browser Worker and Node worker_threads. */

export type WorkerRequest =
  | {
      id: number;
      type: 'solve';
      scheme: 'wesolowski' | 'pietrzak';
      bits: 256 | 512 | 1024 | 2048;
      challengeHex: string;
      difficulty: number;
      discriminant?: string;
    }
  | {
      id: number;
      type: 'verify';
      scheme: 'wesolowski' | 'pietrzak';
      bits: 256 | 512 | 1024 | 2048;
      challengeHex: string;
      difficulty: number;
      proofHex: string;
      discriminant?: string;
    };

export type WorkerResponse =
  | { id: number; ok: true; type: 'solve'; proofHex: string }
  | { id: number; ok: true; type: 'verify' }
  | { id: number; ok: false; error: string };

export function bytesToHex(b: Uint8Array): string {
  return Array.from(b)
    .map((x) => x.toString(16).padStart(2, '0'))
    .join('');
}

export function hexToBytes(hex: string): Uint8Array {
  const h = hex.length % 2 === 0 ? hex : `0${hex}`;
  const out = new Uint8Array(h.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(h.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}
