#!/usr/bin/env node
/**
 * Benchmark suite for crypto-vdf (issue #8).
 * Warmup + median of N runs; optional regression thresholds via BENCH_MAX_MS_JSON.
 *
 * Usage:
 *   npm run bench
 *   BENCH_RUNS=5 npm run bench
 *   BENCH_FAIL_ON_REGRESSION=1 BENCH_MAX_MS_JSON='{"wesolowski-256-solve":5000}' npm run bench
 */
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
// Prefer built dist
const {
  WesolowskiVDFParams,
  PietrzakVDFParams,
  DISCRIMINANT_256,
  DISCRIMINANT_512,
} = require(path.join(root, 'dist/index.js'));

const RUNS = Math.max(1, parseInt(process.env.BENCH_RUNS || '5', 10));
const WARMUP = Math.max(0, parseInt(process.env.BENCH_WARMUP || '1', 10));
const OUT = process.env.BENCH_OUT || path.join(root, 'bench-results.json');

function median(xs) {
  const a = [...xs].sort((x, y) => x - y);
  const m = Math.floor(a.length / 2);
  return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
}

async function timeMs(fn) {
  const t0 = process.hrtime.bigint();
  await fn();
  const t1 = process.hrtime.bigint();
  return Number(t1 - t0) / 1e6;
}

async function measure(name, fn) {
  for (let i = 0; i < WARMUP; i++) await fn();
  const samples = [];
  for (let i = 0; i < RUNS; i++) samples.push(await timeMs(fn));
  return {
    name,
    runs: RUNS,
    warmup: WARMUP,
    samplesMs: samples.map((x) => Math.round(x * 100) / 100),
    medianMs: Math.round(median(samples) * 100) / 100,
    minMs: Math.round(Math.min(...samples) * 100) / 100,
    maxMs: Math.round(Math.max(...samples) * 100) / 100,
  };
}

async function main() {
  const challenge = new Uint8Array([0xaa, 0xbb, 0xcc]);
  const d256 = DISCRIMINANT_256;
  const d512 = DISCRIMINANT_512;
  const w256 = new WesolowskiVDFParams(256).new();
  const p256 = new PietrzakVDFParams(256).new();
  const w512 = new WesolowskiVDFParams(512).new();

  const difficulty = parseInt(process.env.BENCH_DIFFICULTY || '66', 10);
  const results = [];

  let proofW;
  results.push(
    await measure('wesolowski-256-solve', async () => {
      proofW = await w256.solve(challenge, difficulty, d256);
    })
  );
  results.push(
    await measure('wesolowski-256-verify', async () => {
      w256.verify(challenge, difficulty, proofW, d256);
    })
  );

  let proofP;
  results.push(
    await measure('pietrzak-256-solve', async () => {
      proofP = await p256.solve(challenge, difficulty, d256);
    })
  );
  results.push(
    await measure('pietrzak-256-verify', async () => {
      p256.verify(challenge, difficulty, proofP, d256);
    })
  );

  if (process.env.BENCH_INCLUDE_512 === '1') {
    let proof512;
    results.push(
      await measure('wesolowski-512-solve', async () => {
        proof512 = await w512.solve(challenge, difficulty, d512);
      })
    );
    results.push(
      await measure('wesolowski-512-verify', async () => {
        w512.verify(challenge, difficulty, proof512, d512);
      })
    );
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    difficulty,
    node: process.version,
    platform: process.platform,
    arch: process.arch,
    results,
  };

  fs.writeFileSync(OUT, JSON.stringify(payload, null, 2));
  console.log('\nBenchmark results (median ms)\n');
  console.log(
    '| name | median | min | max |'
  );
  console.log('| --- | ---: | ---: | ---: |');
  for (const r of results) {
    console.log(`| ${r.name} | ${r.medianMs} | ${r.minMs} | ${r.maxMs} |`);
  }
  console.log(`\nWrote ${OUT}`);

  if (process.env.BENCH_FAIL_ON_REGRESSION === '1') {
    const raw = process.env.BENCH_MAX_MS_JSON;
    if (!raw) {
      console.error('BENCH_FAIL_ON_REGRESSION=1 requires BENCH_MAX_MS_JSON');
      process.exit(2);
    }
    const caps = JSON.parse(raw);
    let failed = false;
    for (const r of results) {
      if (caps[r.name] != null && r.medianMs > caps[r.name]) {
        console.error(
          `REGRESSION ${r.name}: median ${r.medianMs}ms > cap ${caps[r.name]}ms`
        );
        failed = true;
      }
    }
    if (failed) process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
