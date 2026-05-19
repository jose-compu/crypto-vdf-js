// Copyright 2025 VDF-JS Contributors
//
// Licensed under the Apache License, Version 2.0
//
// Fast Jest checks only: verify golden proofs + reject tampered proofs.
// Solve/determinism lives in tests/manual/test-golden-determinism.js (slow).

import * as fs from 'fs';
import * as path from 'path';
import {
  PietrzakVDFParams,
  WesolowskiVDFParams,
  InvalidProof,
} from '../src/index';

interface GoldenVector {
  id: string;
  scheme: 'wesolowski' | 'pietrzak';
  bits: number;
  difficulty: number;
  discriminant: string;
  challenge: string;
  proof: string;
}

interface GoldenFile {
  version: number;
  vectors: GoldenVector[];
}

function hexToBytes(hex: string): Uint8Array {
  return new Uint8Array(Buffer.from(hex, 'hex'));
}

describe('Golden regression vectors (verify only)', () => {
  const fixturePath = path.join(__dirname, 'fixtures', 'golden-vectors.json');
  const data: GoldenFile = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));

  // One Wesolowski case is enough for CI; full set checked in npm run test:golden
  const quickVectors = data.vectors.filter((v) => v.scheme === 'wesolowski').slice(0, 1);

  test.each(quickVectors)('$id verifies stored proof', (vector: GoldenVector) => {
    const challenge = hexToBytes(vector.challenge);
    const proof = hexToBytes(vector.proof);
    const discriminant = BigInt(vector.discriminant);

    const vdf =
      vector.scheme === 'wesolowski'
        ? new WesolowskiVDFParams(vector.bits).new()
        : new PietrzakVDFParams(vector.bits).new();

    expect(() =>
      vdf.verify(challenge, vector.difficulty, proof, discriminant)
    ).not.toThrow();
  });

  test('tampered proof is rejected', () => {
    const vector = data.vectors[0];
    const challenge = hexToBytes(vector.challenge);
    const discriminant = BigInt(vector.discriminant);
    const badProof = hexToBytes(vector.proof);
    badProof[0] ^= 0xff;

    const vdf = new WesolowskiVDFParams(vector.bits).new();
    expect(() =>
      vdf.verify(challenge, vector.difficulty, badProof, discriminant)
    ).toThrow(InvalidProof);
  });
});
