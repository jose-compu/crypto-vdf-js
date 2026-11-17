# Rust reference parity (issue #5)

## Goal

Cross-check this TypeScript port against [poanetwork/vdf](https://github.com/poanetwork/vdf) (Rust + GMP).

## What is checked in CI

| Artifact | Role |
|----------|------|
| `golden-vectors.json` | Fixed (challenge, difficulty, discriminant, proof) tuples |
| `tests/golden-vectors.test.ts` | Verify-only Jest (tamper rejection) |
| `npm run test:golden` | Solve + re-verify determinism |

Discriminants `DISCRIMINANT_*` (256–2048) were generated with Rust GMP and match the mathematical constraints used by the reference (`≡ 1 mod 4`, `≡ 1 mod 8`, negative).

`DISCRIMINANT_4096` was generated with `scripts/generate-precomputed-4096.c` (OpenSSL 3 BN Miller–Rabin, 64 checks; `npm run generate:4096`). Same constraints: negative, `|D| ≡ 7 (mod 8)`. Regeneration draws a **new** random prime — see README “Regenerate DISCRIMINANT_4096”.

## Vector format

```json
{
  "id": "wesolowski-256-d66",
  "scheme": "wesolowski" | "pietrzak",
  "bits": 256,
  "difficulty": 66,
  "discriminant": "<decimal string>",
  "challenge": "<hex>",
  "proof": "<hex>",
  "source": "crypto-vdf@x.y.z",
  "note": "..."
}
```

Regenerate:

```bash
npm run fixtures:generate
```

## Importing external Rust dumps

If you export vectors from the Rust crate, place them under `tests/fixtures/` with the same schema and set `"source": "poanetwork/vdf@…"`. Jest golden tests load every vector in the file.

## Manual bridge

`tests/manual/compare-rust-js.js` (if present) can be used for ad-hoc side-by-side checks when a Rust binary is available locally.
