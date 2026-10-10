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

import {
  decodeProof,
  encodeProof,
  hexToProof,
  proofToBase64,
  proofToHex,
} from '../src/proof-codec';

describe('proof codec', () => {
  const sample = new Uint8Array([0xaa, 0xbb, 0xcc, 0x01, 0xff]);

  test('hex round-trip', () => {
    const encoded = encodeProof(sample, 'hex');
    expect(encoded).toBe('aabbcc01ff');
    expect(Array.from(decodeProof(encoded, 'hex'))).toEqual(Array.from(sample));
    expect(Array.from(hexToProof(proofToHex(sample)))).toEqual(Array.from(sample));
  });

  test('hex accepts 0x prefix', () => {
    expect(Array.from(decodeProof('0xAAbb', 'hex'))).toEqual([0xaa, 0xbb]);
  });

  test('base64 round-trip', () => {
    const encoded = encodeProof(sample, 'base64');
    expect(Array.from(decodeProof(encoded, 'base64'))).toEqual(Array.from(sample));
    expect(Array.from(decodeProof(proofToBase64(sample), 'base64'))).toEqual(
      Array.from(sample)
    );
  });

  test('json round-trip', () => {
    const encoded = encodeProof(sample, 'json');
    const parsed = JSON.parse(encoded);
    expect(parsed.type).toBe('crypto-vdf-proof');
    expect(parsed.version).toBe(1);
    expect(parsed.proof).toBe('aabbcc01ff');
    expect(Array.from(decodeProof(encoded, 'json'))).toEqual(Array.from(sample));
  });

  test('rejects empty / invalid inputs', () => {
    expect(() => encodeProof(new Uint8Array(), 'hex')).toThrow(RangeError);
    expect(() => decodeProof('', 'hex')).toThrow(RangeError);
    expect(() => decodeProof('abc', 'hex')).toThrow(RangeError);
    expect(() => decodeProof('{"type":"nope"}', 'json')).toThrow(RangeError);
    expect(() => decodeProof('not-json', 'json')).toThrow(RangeError);
  });
});
