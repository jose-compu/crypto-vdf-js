#!/usr/bin/env node
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
 * Local CLI: solve and verify VDFs without writing a script.
 *
 *   npx crypto-vdf solve --challenge aa --difficulty 66
 *   npx crypto-vdf verify --challenge aa --difficulty 66 --proof <hex>
 */

import { createVdf, type VdfBitSize, type VdfScheme } from './facade';
import { proofToHex, hexToProof } from './proof-codec';

const VERSION = '1.8.0';

function usage(exitCode = 0): never {
  const msg = `crypto-vdf ${VERSION}

Usage:
  crypto-vdf solve  --challenge <hex> --difficulty <n> [options]
  crypto-vdf verify --challenge <hex> --difficulty <n> --proof <hex> [options]
  crypto-vdf version
  crypto-vdf help

Options:
  --scheme <wesolowski|pietrzak>   default: wesolowski
  --bits <256|512|1024|2048>       default: 256
  --format <hex|base64>            proof output/input for solve (default hex)
  --json                           print machine-readable JSON on success

Examples:
  crypto-vdf solve --challenge deadbeef --difficulty 66
  crypto-vdf verify --challenge deadbeef --difficulty 66 --proof <hex-from-solve>
`;
  process.stdout.write(msg);
  process.exit(exitCode);
}

function parseArgs(argv: string[]): Record<string, string | boolean> {
  const out: Record<string, string | boolean> = {};
  let i = 0;
  while (i < argv.length) {
    const a = argv[i];
    if (a === '--json') {
      out.json = true;
      i += 1;
      continue;
    }
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const val = argv[i + 1];
      if (!val || val.startsWith('--')) {
        throw new Error(`Missing value for --${key}`);
      }
      out[key] = val;
      i += 2;
      continue;
    }
    if (!out._cmd) {
      out._cmd = a;
    } else {
      throw new Error(`Unexpected argument: ${a}`);
    }
    i += 1;
  }
  return out;
}

function parseChallenge(hex: string): Uint8Array {
  const clean = hex.replace(/^0x/i, '').replace(/\s+/g, '').toLowerCase();
  if (!/^[0-9a-f]+$/.test(clean) || clean.length % 2 !== 0) {
    throw new Error('Invalid --challenge: expected even-length hex');
  }
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

function parseBits(raw: string | undefined): VdfBitSize {
  const n = Number(raw ?? '256');
  if (![256, 512, 1024, 2048].includes(n)) {
    throw new Error('--bits must be 256, 512, 1024, or 2048');
  }
  return n as VdfBitSize;
}

function parseScheme(raw: string | undefined): VdfScheme {
  const s = (raw ?? 'wesolowski').toLowerCase();
  if (s !== 'wesolowski' && s !== 'pietrzak') {
    throw new Error('--scheme must be wesolowski or pietrzak');
  }
  return s;
}

async function cmdSolve(flags: Record<string, string | boolean>): Promise<void> {
  const challengeHex = flags.challenge;
  const diffRaw = flags.difficulty;
  if (typeof challengeHex !== 'string' || typeof diffRaw !== 'string') {
    throw new Error('solve requires --challenge <hex> and --difficulty <n>');
  }
  const difficulty = Number(diffRaw);
  if (!Number.isInteger(difficulty) || difficulty < 1) {
    throw new Error('--difficulty must be a positive integer');
  }
  const scheme = parseScheme(typeof flags.scheme === 'string' ? flags.scheme : undefined);
  const bits = parseBits(typeof flags.bits === 'string' ? flags.bits : undefined);
  const format = (typeof flags.format === 'string' ? flags.format : 'hex').toLowerCase();
  if (format !== 'hex' && format !== 'base64') {
    throw new Error('--format must be hex or base64');
  }

  const challenge = parseChallenge(challengeHex);
  const handle = createVdf({ scheme, bits });
  const proof = await handle.solve(challenge, difficulty);
  const encoded =
    format === 'hex'
      ? proofToHex(proof)
      : Buffer.from(proof).toString('base64');

  if (flags.json) {
    process.stdout.write(
      JSON.stringify(
        {
          ok: true,
          command: 'solve',
          scheme,
          bits,
          difficulty,
          challenge: challengeHex.replace(/^0x/i, '').toLowerCase(),
          format,
          proof: encoded,
        },
        null,
        2
      ) + '\n'
    );
  } else {
    process.stdout.write(encoded + '\n');
  }
}

async function cmdVerify(flags: Record<string, string | boolean>): Promise<void> {
  const challengeHex = flags.challenge;
  const diffRaw = flags.difficulty;
  const proofRaw = flags.proof;
  if (
    typeof challengeHex !== 'string' ||
    typeof diffRaw !== 'string' ||
    typeof proofRaw !== 'string'
  ) {
    throw new Error('verify requires --challenge, --difficulty, and --proof');
  }
  const difficulty = Number(diffRaw);
  if (!Number.isInteger(difficulty) || difficulty < 1) {
    throw new Error('--difficulty must be a positive integer');
  }
  const scheme = parseScheme(typeof flags.scheme === 'string' ? flags.scheme : undefined);
  const bits = parseBits(typeof flags.bits === 'string' ? flags.bits : undefined);
  const format = (typeof flags.format === 'string' ? flags.format : 'hex').toLowerCase();

  const challenge = parseChallenge(challengeHex);
  let proof: Uint8Array;
  if (format === 'base64') {
    proof = new Uint8Array(Buffer.from(proofRaw, 'base64'));
  } else {
    proof = hexToProof(proofRaw);
  }

  const handle = createVdf({ scheme, bits });
  handle.verify(challenge, difficulty, proof);

  if (flags.json) {
    process.stdout.write(
      JSON.stringify({ ok: true, command: 'verify', scheme, bits, difficulty }, null, 2) +
        '\n'
    );
  } else {
    process.stdout.write('valid\n');
  }
}

export async function main(argv: string[] = process.argv.slice(2)): Promise<void> {
  if (argv.length === 0 || argv[0] === 'help' || argv[0] === '--help' || argv[0] === '-h') {
    usage(0);
  }
  if (argv[0] === 'version' || argv[0] === '--version' || argv[0] === '-V') {
    process.stdout.write(`${VERSION}\n`);
    return;
  }

  let flags: Record<string, string | boolean>;
  try {
    flags = parseArgs(argv);
  } catch (e) {
    process.stderr.write((e instanceof Error ? e.message : String(e)) + '\n');
    usage(1);
  }

  const cmd = flags._cmd;
  try {
    if (cmd === 'solve') {
      await cmdSolve(flags);
    } else if (cmd === 'verify') {
      await cmdVerify(flags);
    } else {
      process.stderr.write(`Unknown command: ${String(cmd)}\n`);
      usage(1);
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (flags.json) {
      process.stderr.write(JSON.stringify({ ok: false, error: msg }) + '\n');
    } else {
      process.stderr.write(msg + '\n');
    }
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch((e) => {
    process.stderr.write((e instanceof Error ? e.message : String(e)) + '\n');
    process.exit(1);
  });
}
