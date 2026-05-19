/**
 * Shared verbose logging for slow manual VDF tests.
 * Set VDF_VERBOSE=0 to reduce output; default is verbose.
 */

const VERBOSE = process.env.VDF_VERBOSE !== '0';
const HEARTBEAT_MS = Number(process.env.VDF_HEARTBEAT_MS || 5000);

function ts() {
  return new Date().toISOString().slice(11, 23);
}

function elapsedMs(start) {
  const ms = Date.now() - start;
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.floor(ms / 60000)}m ${((ms % 60000) / 1000).toFixed(0)}s`;
}

function log(message, { force = false } = {}) {
  if (!VERBOSE && !force) return;
  console.log(`[${ts()}] ${message}`);
}

/**
 * Log every heartbeatMs while promise is pending (proves the process is not stuck).
 */
async function withHeartbeat(promise, label, heartbeatMs = HEARTBEAT_MS) {
  const start = Date.now();
  let ticks = 0;
  log(`START ${label} (timeout heartbeat every ${heartbeatMs / 1000}s)`);

  const interval = setInterval(() => {
    ticks += 1;
    log(`… still running: ${label} — ${elapsedMs(start)} elapsed (tick ${ticks})`, { force: true });
  }, heartbeatMs);

  try {
    const result = await promise;
    log(`DONE  ${label} in ${elapsedMs(start)}`);
    return result;
  } catch (err) {
    log(`FAIL  ${label} after ${elapsedMs(start)}: ${err.message}`, { force: true });
    throw err;
  } finally {
    clearInterval(interval);
  }
}

function logSuitePlan(totalCases, suiteName) {
  log(`Suite "${suiteName}": ${totalCases} case(s) planned`, { force: true });
}

function logCaseProgress(index, total, description) {
  log(`--- [${index}/${total}] ${description} ---`, { force: true });
}

module.exports = {
  VERBOSE,
  HEARTBEAT_MS,
  ts,
  elapsedMs,
  log,
  withHeartbeat,
  logSuitePlan,
  logCaseProgress,
};
