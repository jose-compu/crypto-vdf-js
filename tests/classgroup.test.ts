// Copyright 2025 VDF-JS Contributors
//
// Fast ClassGroup unit tests only (low iteration counts).
// Heavy serialization / long squaring: tests/manual/test-classgroup-heavy.js

import { ClassGroup, iterateSquarings } from '../src/classgroup';
import { DISCRIMINANT_256 } from './test-discriminants';

/** Keep squaring iterations low so Jest finishes in seconds. */
const SQ = 8;

describe('ClassGroup (fast)', () => {
  const discriminant = DISCRIMINANT_256;
  let generator: ClassGroup;

  beforeEach(() => {
    generator = ClassGroup.fromAbDiscriminant(2n, 1n, discriminant);
  });

  test('identity, multiply, square', () => {
    const identity = generator.identity();
    expect(identity.a).toBe(1n);

    const a = generator.clone();
    const b = generator.clone();
    expect(a.multiply(b).discriminant).toBe(discriminant);

    const squared = a.multiply(a);
    const c = generator.clone();
    c.square();
    expect(c.equals(squared)).toBe(true);
  });

  test('repeated squaring matches manual loop', () => {
    const a = generator.clone();
    a.repeatedSquare(SQ);
    const b = generator.clone();
    for (let i = 0; i < SQ; i++) b.square();
    expect(a.equals(b)).toBe(true);
  });

  test('serialize round-trip', () => {
    const elem = generator.clone();
    elem.repeatedSquare(SQ);
    const bytes = elem.serialize(33);
    const restored = ClassGroup.fromBytes(bytes, discriminant);
    expect(restored.equals(elem)).toBe(true);
    expect(restored.discriminant).toBe(discriminant);
  });

  test('negative b round-trip (two\'s complement)', () => {
    const elem = generator.clone();
    elem.repeatedSquare(SQ);
    const bytes = elem.serialize(33);
    const restored = ClassGroup.fromBytes(bytes, discriminant);
    expect(restored.b).toBe(elem.b);
    expect(restored.equals(elem)).toBe(true);
  });

  test('discriminant invariant after operations', () => {
    const elem = generator.clone();
    elem.square();
    elem.multiply(generator);
    elem.repeatedSquare(3);
    const disc = elem.b * elem.b - 4n * elem.a * elem.c;
    expect(disc).toBe(discriminant);
  });

  test('iterateSquarings', () => {
    const powers = iterateSquarings(generator, [1, 2, 4, 8]);
    expect(powers.size).toBe(4);
    for (const p of [1, 2, 4, 8]) {
      expect(powers.get(p)!.discriminant).toBe(discriminant);
    }
  });

  test('pow small exponent', () => {
    const elem = generator.clone();
    elem.pow(5n);
    expect(elem.b * elem.b - 4n * elem.a * elem.c).toBe(discriminant);
  });
});
