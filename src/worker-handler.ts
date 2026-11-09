// Copyright 2025 VDF-JS Contributors
// Licensed under the Apache License, Version 2.0.

import { PietrzakVDFParams } from './pietrzak';
import { WesolowskiVDFParams } from './wesolowski';
import { getPrecomputedDiscriminant } from './precomputed-discriminants';
import type { WorkerRequest, WorkerResponse } from './worker-protocol';
import { hexToBytes, bytesToHex } from './worker-protocol';

function makeVdf(scheme: 'wesolowski' | 'pietrzak', bits: number) {
  return scheme === 'wesolowski'
    ? new WesolowskiVDFParams(bits).new()
    : new PietrzakVDFParams(bits).new();
}

/**
 * Handle one worker request (browser or Node).
 */
export async function handleWorkerRequest(
  msg: WorkerRequest
): Promise<WorkerResponse> {
  try {
    const bits = msg.bits;
    const disc =
      msg.discriminant != null
        ? BigInt(msg.discriminant)
        : getPrecomputedDiscriminant(bits);
    const vdf = makeVdf(msg.scheme, bits);
    const challenge = hexToBytes(msg.challengeHex);

    if (msg.type === 'solve') {
      const proof = await vdf.solve(challenge, msg.difficulty, disc);
      return { id: msg.id, ok: true, type: 'solve', proofHex: bytesToHex(proof) };
    }

    vdf.verify(challenge, msg.difficulty, hexToBytes(msg.proofHex), disc);
    return { id: msg.id, ok: true, type: 'verify' };
  } catch (e) {
    const error = e instanceof Error ? e.message : String(e);
    return { id: msg.id, ok: false, error };
  }
}
