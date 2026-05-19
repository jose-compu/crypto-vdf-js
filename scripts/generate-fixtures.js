#!/usr/bin/env node
/**
 * Regenerate tests/fixtures/golden-vectors.json
 * Run after build: npm run build:node && npm run fixtures:generate
 */
const fs = require('fs');
const path = require('path');
const vdf = require('../dist/index.js');

const CHALLENGE = Buffer.from([0xaa, 0xbb, 0xcc]);

const CASES = [
  { scheme: 'wesolowski', bits: 256, difficulty: 66, disc: 'DISCRIMINANT_256' },
  { scheme: 'wesolowski', bits: 256, difficulty: 100, disc: 'DISCRIMINANT_256' },
  { scheme: 'pietrzak', bits: 256, difficulty: 66, disc: 'DISCRIMINANT_256' },
  { scheme: 'pietrzak', bits: 256, difficulty: 100, disc: 'DISCRIMINANT_256' },
];

async function main() {
  const pkg = require('../package.json');
  const vectors = [];

  for (const c of CASES) {
    const discriminant = vdf[c.disc];
    const Params =
      c.scheme === 'wesolowski' ? vdf.WesolowskiVDFParams : vdf.PietrzakVDFParams;
    const inst = new Params(c.bits).new();
    const proof = await inst.solve(CHALLENGE, c.difficulty, discriminant);

    vectors.push({
      id: `${c.scheme}-${c.bits}-d${c.difficulty}`,
      scheme: c.scheme,
      bits: c.bits,
      difficulty: c.difficulty,
      discriminant: discriminant.toString(10),
      challenge: CHALLENGE.toString('hex'),
      proof: Buffer.from(proof).toString('hex'),
      source: `crypto-vdf@${pkg.version}`,
      note: 'Golden regression vector; regenerate with npm run fixtures:generate',
    });
  }

  const outPath = path.join(__dirname, '../tests/fixtures/golden-vectors.json');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(
    outPath,
    JSON.stringify(
      {
        version: 1,
        generatedAt: new Date().toISOString(),
        vectors,
      },
      null,
      2
    )
  );
  console.log(`Wrote ${vectors.length} vectors to ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
