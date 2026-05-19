/**
 * Comprehensive test for both Pietrzak and Wesolowski VDFs
 *
 * Tests both VDF implementations across:
 * - Various difficulties (66 to 10000)
 * - Different bit sizes (256, 512, 1024, 2048)
 *
 * Verbose by default: heartbeat every 5s during slow solves.
 * Quiet mode: VDF_VERBOSE=0 node tests/manual/test-both-vdfs-comprehensive.js
 */

const vdf = require('../../dist/index.js');
const { log, withHeartbeat, logSuitePlan, logCaseProgress, elapsedMs } = require('./verbose');

function logResult(message, status = 'info') {
  const colors = {
    info: '\x1b[36m',
    success: '\x1b[32m',
    error: '\x1b[31m',
    default: '\x1b[0m',
  };
  console.log(`${colors[status]}${message}${colors.default}`);
}

async function testVDF(vdfType, bitSize, difficulty, discriminant, timeoutMs = 30000) {
  const challenge = new Uint8Array([0xaa, 0xbb, 0xcc]);
  const label = `${vdfType} ${bitSize}-bit difficulty=${difficulty}`;

  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('TIMEOUT')), timeoutMs)
  );

  const testPromise = (async () => {
    const VDFClass = vdfType === 'Pietrzak' ? vdf.PietrzakVDFParams : vdf.WesolowskiVDFParams;
    const vdfInstance = new VDFClass(bitSize).new();

    const solveStart = Date.now();
    const proof = await withHeartbeat(
      vdfInstance.solve(challenge, difficulty, discriminant),
      `${label} — solve`
    );
    const solveTime = Date.now() - solveStart;

    log(`  → solve finished (${solveTime}ms), starting verify…`);

    const verifyStart = Date.now();
    await withHeartbeat(
      Promise.resolve().then(() =>
        vdfInstance.verify(challenge, difficulty, proof, discriminant)
      ),
      `${label} — verify`,
      Math.min(5000, timeoutMs)
    );
    const verifyTime = Date.now() - verifyStart;

    return {
      success: true,
      solveTime,
      verifyTime,
      proofSize: proof.length,
    };
  })();

  try {
    return await Promise.race([testPromise, timeoutPromise]);
  } catch (e) {
    return {
      success: false,
      error: e.message === 'TIMEOUT' ? `TIMEOUT after ${timeoutMs}ms` : e.message,
    };
  }
}

function countPlannedCases(testConfigs) {
  let n = 0;
  for (const config of testConfigs) {
    for (const test of config.tests) {
      n += test.difficulties.length;
    }
  }
  return n;
}

async function runTestSuite() {
  const suiteStart = Date.now();
  logResult('╔════════════════════════════════════════════════════════════════╗', 'info');
  logResult('║  Comprehensive VDF Test Suite (verbose)                        ║', 'info');
  logResult('╚════════════════════════════════════════════════════════════════╝', 'info');
  log('Heartbeat enabled — you should see progress every few seconds on long solves.', {
    force: true,
  });

  const testConfigs = [
    {
      name: 'Minimum difficulties (66-100)',
      tests: [
        { type: 'Pietrzak', bits: 256, difficulties: [66, 68, 70, 80, 90, 100], disc: vdf.DISCRIMINANT_256 },
        { type: 'Wesolowski', bits: 256, difficulties: [66, 68, 70, 80, 90, 100], disc: vdf.DISCRIMINANT_256 },
      ],
    },
    {
      name: 'Powers of 2 (128-1024)',
      tests: [
        { type: 'Pietrzak', bits: 256, difficulties: [128, 256, 512, 1024], disc: vdf.DISCRIMINANT_256 },
        { type: 'Wesolowski', bits: 256, difficulties: [128, 256, 512, 1024], disc: vdf.DISCRIMINANT_256 },
      ],
    },
    {
      name: 'High difficulties (2000-7000) - Note: Pietrzak has known limitation >7000',
      tests: [
        { type: 'Pietrzak', bits: 256, difficulties: [2000, 5000, 7000], disc: vdf.DISCRIMINANT_256 },
        { type: 'Wesolowski', bits: 256, difficulties: [2000, 5000, 7000, 10000], disc: vdf.DISCRIMINANT_256 },
      ],
    },
    {
      name: 'Different bit sizes (256, 512, 1024)',
      tests: [
        { type: 'Pietrzak', bits: 256, difficulties: [100], disc: vdf.DISCRIMINANT_256 },
        { type: 'Pietrzak', bits: 512, difficulties: [100], disc: vdf.DISCRIMINANT_512 },
        { type: 'Pietrzak', bits: 1024, difficulties: [100], disc: vdf.DISCRIMINANT_1024 },
        { type: 'Wesolowski', bits: 256, difficulties: [100], disc: vdf.DISCRIMINANT_256 },
        { type: 'Wesolowski', bits: 512, difficulties: [100], disc: vdf.DISCRIMINANT_512 },
        { type: 'Wesolowski', bits: 1024, difficulties: [100], disc: vdf.DISCRIMINANT_1024 },
      ],
    },
    {
      name: '2048-bit smoke (CI: lower difficulty, longer timeout)',
      tests: [
        { type: 'Pietrzak', bits: 2048, difficulties: [66], disc: vdf.DISCRIMINANT_2048, timeoutMs: 120000 },
        { type: 'Wesolowski', bits: 2048, difficulties: [66], disc: vdf.DISCRIMINANT_2048, timeoutMs: 120000 },
        { type: 'Wesolowski', bits: 2048, difficulties: [100], disc: vdf.DISCRIMINANT_2048, timeoutMs: 180000 },
      ],
    },
  ];

  const totalPlanned = countPlannedCases(testConfigs);
  logSuitePlan(totalPlanned, 'comprehensive');

  let caseIndex = 0;
  let totalPassed = 0;
  let totalFailed = 0;

  for (const config of testConfigs) {
    logResult(`\n${'='.repeat(60)}`, 'default');
    logResult(`${config.name}`, 'info');
    logResult('='.repeat(60), 'default');

    for (const test of config.tests) {
      for (const diff of test.difficulties) {
        caseIndex += 1;
        const desc = `${test.type} ${test.bits}-bit difficulty ${diff}`;
        logCaseProgress(caseIndex, totalPlanned, desc);

        const timeoutMs = test.timeoutMs ?? 30000;
        log(`  timeout budget: ${timeoutMs}ms`, { force: true });

        const result = await testVDF(test.type, test.bits, diff, test.disc, timeoutMs);

        if (result.success) {
          logResult(
            `  ✓ ${result.solveTime}ms solve, ${result.verifyTime}ms verify, proof ${result.proofSize}B`,
            'success'
          );
          totalPassed++;
        } else {
          logResult(`  ✗ ${result.error}`, 'error');
          totalFailed++;
        }
      }
    }
  }

  logResult('\n' + '='.repeat(60), 'default');
  logResult('Final Summary:', 'info');
  logResult('='.repeat(60), 'default');
  logResult(`  Total tests: ${totalPlanned}`, 'default');
  logResult(`  Passed: ${totalPassed}`, 'success');
  logResult(`  Failed: ${totalFailed}`, totalFailed > 0 ? 'error' : 'success');
  logResult(
    `  Wall time: ${elapsedMs(suiteStart)}`,
    totalFailed === 0 ? 'success' : 'error'
  );
  logResult(
    `  Success rate: ${((totalPassed / totalPlanned) * 100).toFixed(1)}%`,
    totalFailed === 0 ? 'success' : 'error'
  );

  if (totalFailed === 0) {
    logResult('\n✓ All tests passed! Both VDFs are working correctly.', 'success');
    process.exit(0);
  } else {
    logResult('\n✗ Some tests failed! Issues detected.', 'error');
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
