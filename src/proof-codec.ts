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

/** Wire / storage formats for VDF proof bytes. */
export type ProofFormat = 'hex' | 'base64' | 'json';

export interface JsonProofEnvelope {
  /** Always `"crypto-vdf-proof"` for this library's JSON envelope. */
  type: 'crypto-vdf-proof';
  /** Encoding version. */
  version: 1;
  /** Proof bytes as lowercase hex (no `0x` prefix). */
  proof: string;
}

function bytesToHex(bytes: Uint8Array): string {
  let out = '';
  for (let i = 0; i < bytes.length; i++) {
    out += bytes[i].toString(16).padStart(2, '0');
  }
  return out;
}

function hexToBytes(hex: string): Uint8Array {
  const clean = hex.replace(/^0x/i, '').replace(/\s+/g, '').toLowerCase();
  if (!/^[0-9a-f]*$/.test(clean) || clean.length % 2 !== 0) {
    throw new RangeError('Invalid hex proof: expected even-length hexadecimal');
  }
  if (clean.length === 0) {
    throw new RangeError('Invalid hex proof: empty');
  }
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

function bytesToBase64(bytes: Uint8Array): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes).toString('base64');
  }
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToBytes(b64: string): Uint8Array {
  const clean = b64.replace(/\s+/g, '');
  if (typeof Buffer !== 'undefined') {
    return new Uint8Array(Buffer.from(clean, 'base64'));
  }
  const binary = atob(clean);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    out[i] = binary.charCodeAt(i);
  }
  return out;
}

/**
 * Encode proof bytes for storage or transport.
 *
 * - `hex` — lowercase hex string (no `0x`)
 * - `base64` — standard Base64
 * - `json` — JSON string of {@link JsonProofEnvelope}
 */
export function encodeProof(proof: Uint8Array, format: ProofFormat): string {
  if (!(proof instanceof Uint8Array) || proof.length === 0) {
    throw new RangeError('proof must be a non-empty Uint8Array');
  }
  switch (format) {
    case 'hex':
      return bytesToHex(proof);
    case 'base64':
      return bytesToBase64(proof);
    case 'json': {
      const envelope: JsonProofEnvelope = {
        type: 'crypto-vdf-proof',
        version: 1,
        proof: bytesToHex(proof),
      };
      return JSON.stringify(envelope);
    }
    default:
      throw new RangeError(`Unsupported proof format: ${format as string}`);
  }
}

/**
 * Decode a proof previously produced by {@link encodeProof}.
 */
export function decodeProof(encoded: string, format: ProofFormat): Uint8Array {
  if (typeof encoded !== 'string' || encoded.length === 0) {
    throw new RangeError('encoded proof must be a non-empty string');
  }
  switch (format) {
    case 'hex':
      return hexToBytes(encoded);
    case 'base64': {
      const bytes = base64ToBytes(encoded);
      if (bytes.length === 0) {
        throw new RangeError('Invalid base64 proof: empty');
      }
      return bytes;
    }
    case 'json': {
      let parsed: unknown;
      try {
        parsed = JSON.parse(encoded);
      } catch {
        throw new RangeError('Invalid JSON proof envelope');
      }
      if (
        parsed == null ||
        typeof parsed !== 'object' ||
        (parsed as JsonProofEnvelope).type !== 'crypto-vdf-proof' ||
        (parsed as JsonProofEnvelope).version !== 1 ||
        typeof (parsed as JsonProofEnvelope).proof !== 'string'
      ) {
        throw new RangeError(
          'Invalid JSON proof envelope: expected { type: "crypto-vdf-proof", version: 1, proof: string }'
        );
      }
      return hexToBytes((parsed as JsonProofEnvelope).proof);
    }
    default:
      throw new RangeError(`Unsupported proof format: ${format as string}`);
  }
}

/** Convenience aliases matching common naming. */
export const proofToHex = (proof: Uint8Array): string => encodeProof(proof, 'hex');
export const hexToProof = (hex: string): Uint8Array => decodeProof(hex, 'hex');
export const proofToBase64 = (proof: Uint8Array): string => encodeProof(proof, 'base64');
export const base64ToProof = (b64: string): Uint8Array => decodeProof(b64, 'base64');
