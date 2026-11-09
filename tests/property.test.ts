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

/**
 * Property-based tests (fast-check) for codec and utils round-trips.
 * VDF solve/verify is covered with a small fixed difficulty for speed.
 */

import fc from 'fast-check';
import { bytesToBigInt, bigIntToBytes, bitLength, gcd, modPow } from '../src/utils';
import {
  encodeProof,
  decodeProof,
  proofToHex,
  hexToProof,
  proofToBase64,
  base64ToProof,
} from '../src/proof-codec';
import { createVdf } from '../src/facade';

describe('property: proof-codec round-trip', () => {
  test('hex encode/decode is inverse', () => {
    fc.assert(
      fc.property(fc.uint8Array({ minLength: 1, maxLength: 64 }), (bytes) => {
        const hex = proofToHex(bytes);
        const back = hexToProof(hex);
        expect(Buffer.from(back)).toEqual(Buffer.from(bytes));
      }),
      { numRuns: 40 }
    );
  });

  test('base64 encode/decode is inverse', () => {
    fc.assert(
      fc.property(fc.uint8Array({ minLength: 1, maxLength: 64 }), (bytes) => {
        const b64 = proofToBase64(bytes);
        const back = base64ToProof(b64);
        expect(Buffer.from(back)).toEqual(Buffer.from(bytes));
      }),
      { numRuns: 40 }
    );
  });

  test('json encode/decode is inverse', () => {
    fc.assert(
      fc.property(fc.uint8Array({ minLength: 1, maxLength: 48 }), (bytes) => {
        const json = encodeProof(bytes, 'json');
        const back = decodeProof(json, 'json');
        expect(Buffer.from(back)).toEqual(Buffer.from(bytes));
      }),
      { numRuns: 30 }
    );
  });
});

describe('property: utils', () => {
  test('bytesToBigInt ∘ bigIntToBytes round-trip for positive widths', () => {
    fc.assert(
      fc.property(
        fc.bigInt({ min: 0n, max: 2n ** 128n - 1n }),
        fc.integer({ min: 1, max: 32 }),
        (n, minLen) => {
          const need = n === 0n ? 1 : Math.ceil((bitLength(n) + 7) / 8);
          const width = Math.max(minLen, need);
          const bytes = bigIntToBytes(n, width);
          expect(bytesToBigInt(bytes)).toBe(n);
        }
      ),
      { numRuns: 40 }
    );
  });

  test('gcd(a,b) divides both and is non-negative', () => {
    fc.assert(
      fc.property(
        fc.bigInt({ min: 0n, max: 10_000n }),
        fc.bigInt({ min: 0n, max: 10_000n }),
        (a, b) => {
          const g = gcd(a, b);
          expect(g >= 0n).toBe(true);
          if (a !== 0n) expect(a % g).toBe(0n);
          if (b !== 0n) expect(b % g).toBe(0n);
          if (a === 0n && b === 0n) expect(g).toBe(0n);
        }
      ),
      { numRuns: 40 }
    );
  });

  test('modPow matches iterative multiply for small exponents', () => {
    fc.assert(
      fc.property(
        fc.bigInt({ min: 0n, max: 200n }),
        fc.integer({ min: 0, max: 12 }),
        fc.bigInt({ min: 2n, max: 97n }),
        (base, exp, mod) => {
          let expected = 1n;
          for (let i = 0; i < exp; i++) {
            expected = (expected * base) % mod;
          }
          expect(modPow(base, BigInt(exp), mod)).toBe(expected);
        }
      ),
      { numRuns: 30 }
    );
  });
});

describe('property: VDF solve/verify (small)', () => {
  test('wesolowski: random short challenges verify at difficulty 66', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.uint8Array({ minLength: 1, maxLength: 16 }),
        async (challenge) => {
          const vdf = createVdf({ scheme: 'wesolowski', bits: 256 });
          const proof = await vdf.solve(challenge, 66);
          expect(() => vdf.verify(challenge, 66, proof)).not.toThrow();
        }
      ),
      { numRuns: 3 }
    );
  }, 120_000);
});
