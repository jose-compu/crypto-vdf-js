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

import { PietrzakVDFParams } from './pietrzak';
import { WesolowskiVDFParams } from './wesolowski';
import { getPrecomputedDiscriminant } from './precomputed-discriminants';
import type { VDF } from './types';

/** Supported schemes for {@link createVdf}. */
export type VdfScheme = 'wesolowski' | 'pietrzak';

/** Supported discriminant bit lengths with precomputed constants. */
export type VdfBitSize = 256 | 512 | 1024 | 2048;

export interface CreateVdfOptions {
  /** VDF construction. Default: `'wesolowski'`. */
  scheme?: VdfScheme;
  /** Discriminant bit length. Default: `256`. */
  bits?: VdfBitSize;
  /**
   * Optional custom discriminant. When omitted, uses
   * {@link getPrecomputedDiscriminant} for `bits`.
   */
  discriminant?: bigint;
}

/**
 * High-level handle: `solve` / `verify` / `checkDifficulty` without
 * passing the discriminant on every call.
 */
export interface VdfHandle {
  readonly scheme: VdfScheme;
  readonly bits: VdfBitSize;
  readonly discriminant: bigint;
  /** Underlying VDF instance (Pietrzak or Wesolowski). */
  readonly vdf: VDF;
  checkDifficulty(difficulty: number): void;
  solve(challenge: Uint8Array, difficulty: number): Promise<Uint8Array>;
  verify(challenge: Uint8Array, difficulty: number, proof: Uint8Array): void;
}

/**
 * Create a VDF handle wired to a precomputed discriminant.
 *
 * Additive convenience over `*VDFParams` — existing APIs are unchanged.
 *
 * @example
 * ```ts
 * import { createVdf } from 'crypto-vdf';
 *
 * const vdf = createVdf({ scheme: 'wesolowski', bits: 256 });
 * const proof = await vdf.solve(challenge, 100);
 * vdf.verify(challenge, 100, proof);
 * ```
 */
export function createVdf(options: CreateVdfOptions = {}): VdfHandle {
  const scheme: VdfScheme = options.scheme ?? 'wesolowski';
  const bits = (options.bits ?? 256) as VdfBitSize;

  if (scheme !== 'wesolowski' && scheme !== 'pietrzak') {
    throw new RangeError(`Unsupported scheme "${scheme as string}". Use "wesolowski" or "pietrzak".`);
  }
  if (![256, 512, 1024, 2048].includes(bits)) {
    throw new RangeError(
      `Unsupported bit size ${bits}. Use 256, 512, 1024, or 2048.`
    );
  }

  const discriminant =
    options.discriminant ?? getPrecomputedDiscriminant(bits);

  const vdf: VDF =
    scheme === 'wesolowski'
      ? new WesolowskiVDFParams(bits).new()
      : new PietrzakVDFParams(bits).new();

  return {
    scheme,
    bits,
    discriminant,
    vdf,
    checkDifficulty(difficulty: number): void {
      vdf.checkDifficulty(difficulty);
    },
    solve(challenge: Uint8Array, difficulty: number): Promise<Uint8Array> {
      return vdf.solve(challenge, difficulty, discriminant);
    },
    verify(challenge: Uint8Array, difficulty: number, proof: Uint8Array): void {
      vdf.verify(challenge, difficulty, proof, discriminant);
    },
  };
}

/** Alias matching issue wording (`createVdf` / `createVDF`). */
export const createVDF = createVdf;
