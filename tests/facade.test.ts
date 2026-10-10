// Copyright 2025 VDF-JS Contributors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { createVdf, createVDF } from '../src/facade';
import { DISCRIMINANT_256 } from '../src/precomputed-discriminants';
import { encodeProof, decodeProof } from '../src/proof-codec';
import { InvalidIterations } from '../src/types';

describe('createVdf facade', () => {
  const challenge = new Uint8Array([0xaa, 0xbb, 0xcc]);

  test('defaults to wesolowski 256 with precomputed discriminant', () => {
    const handle = createVdf();
    expect(handle.scheme).toBe('wesolowski');
    expect(handle.bits).toBe(256);
    expect(handle.discriminant).toBe(DISCRIMINANT_256);
  });

  test('createVDF alias matches createVdf', () => {
    expect(createVDF).toBe(createVdf);
  });

  test('wesolowski solve + verify without passing discriminant', async () => {
    const vdf = createVdf({ scheme: 'wesolowski', bits: 256 });
    const proof = await vdf.solve(challenge, 66);
    expect(proof.length).toBeGreaterThan(0);
    expect(() => vdf.verify(challenge, 66, proof)).not.toThrow();
  });

  test('pietrzak solve + verify', async () => {
    const vdf = createVdf({ scheme: 'pietrzak', bits: 256 });
    const proof = await vdf.solve(challenge, 66);
    expect(() => vdf.verify(challenge, 66, proof)).not.toThrow();
  });

  test('checkDifficulty delegates to underlying VDF', () => {
    const pietrzak = createVdf({ scheme: 'pietrzak', bits: 256 });
    expect(() => pietrzak.checkDifficulty(67)).toThrow(InvalidIterations);
    expect(() => pietrzak.checkDifficulty(66)).not.toThrow();
  });

  test('rejects unsupported bits / scheme', () => {
    expect(() => createVdf({ bits: 128 as 256 })).toThrow(RangeError);
    expect(() => createVdf({ scheme: 'nope' as 'wesolowski' })).toThrow(RangeError);
  });

  test('works with encodeProof / decodeProof round-trip', async () => {
    const vdf = createVdf({ scheme: 'wesolowski', bits: 256 });
    const proof = await vdf.solve(challenge, 66);
    const hex = encodeProof(proof, 'hex');
    const restored = decodeProof(hex, 'hex');
    expect(() => vdf.verify(challenge, 66, restored)).not.toThrow();
  });
});
