// Copyright 2025 VDF-JS Contributors
// Licensed under the Apache License, Version 2.0.

/**
 * Lazy-load precomputed discriminants (issue #13).
 * Keeps large 1024/2048 constants out of the default import graph when
 * consumers only need smaller sizes via dynamic import.
 *
 * Prefer static `getPrecomputedDiscriminant` for Node; use this helper
 * when bundling for the browser and code-splitting matters.
 */

import type { VdfBitSize } from './facade';

const cache = new Map<VdfBitSize, bigint>();

/**
 * Dynamically import precomputed discriminants module and return one size.
 * Subsequent calls for the same size hit an in-memory cache.
 */
export async function loadPrecomputedDiscriminant(
  bits: VdfBitSize
): Promise<bigint> {
  const hit = cache.get(bits);
  if (hit !== undefined) return hit;

  const mod = await import('./precomputed-discriminants');
  const value = mod.getPrecomputedDiscriminant(bits);
  cache.set(bits, value);
  return value;
}

/** Drop cached discriminants (tests / memory pressure). */
export function clearDiscriminantCache(): void {
  cache.clear();
}
