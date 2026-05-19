/**
 * Interactive VDF demo — uses crypto-vdf browser bundle (global `vdf`).
 */
(function () {
  const BIT_SIZE = 256;
  const DISCS = {
    256: () => vdf.DISCRIMINANT_256,
    512: () => vdf.DISCRIMINANT_512,
  };

  const $ = (id) => document.getElementById(id);
  const logEl = $('demo-log');
  const runBtn = $('demo-run');
  const randomBtn = $('demo-random-challenge');
  const challengeInput = $('demo-challenge');
  const schemeSelect = $('demo-scheme');
  const difficultySelect = $('demo-difficulty');
  const compareEl = $('demo-compare');

  const stepEls = [1, 2, 3, 4, 5, 6].map((n) => document.querySelector(`[data-demo-step="${n}"]`));

  let running = false;
  let timerId = null;

  function log(msg, type = 'info') {
    const line = document.createElement('div');
    line.className = `demo-log-line demo-log-${type}`;
    const t = new Date().toISOString().slice(11, 23);
    line.textContent = `[${t}] ${msg}`;
    logEl.appendChild(line);
    logEl.scrollTop = logEl.scrollHeight;
  }

  function clearLog() {
    logEl.innerHTML = '';
  }

  function setStep(n, state, detail = '') {
    const el = stepEls[n - 1];
    if (!el) return;
    el.classList.remove('pending', 'active', 'done', 'error');
    el.classList.add(state);
    const detailEl = el.querySelector('.demo-step-detail');
    if (detailEl) detailEl.textContent = detail;
  }

  function resetSteps() {
    stepEls.forEach((el) => {
      el.classList.remove('active', 'done', 'error');
      el.classList.add('pending');
      const d = el.querySelector('.demo-step-detail');
      if (d) d.textContent = '';
    });
    compareEl.hidden = true;
    compareEl.innerHTML = '';
  }

  function hexToBytes(hex) {
    const clean = hex.replace(/\s+/g, '').toLowerCase();
    if (!/^[0-9a-f]*$/.test(clean) || clean.length % 2 !== 0) {
      throw new Error('Challenge must be even-length hexadecimal (e.g. aabbcc).');
    }
    if (clean.length === 0) throw new Error('Challenge cannot be empty.');
    const out = new Uint8Array(clean.length / 2);
    for (let i = 0; i < out.length; i++) {
      out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
    }
    return out;
  }

  function bytesToHex(bytes) {
    return Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  function randomChallenge() {
    const len = 3 + Math.floor(Math.random() * 4);
    const bytes = new Uint8Array(len);
    crypto.getRandomValues(bytes);
    challengeInput.value = bytesToHex(bytes);
  }

  function updateCodePreview() {
    const scheme = schemeSelect.value;
    const diff = difficultySelect.value;
    const cls = scheme === 'wesolowski' ? 'WesolowskiVDFParams' : 'PietrzakVDFParams';
    $('demo-code').textContent = `const vdf = new vdf.${cls}(${BIT_SIZE}).new();
const challenge = new Uint8Array([/* your bytes */]);
const proof = await vdf.solve(challenge, ${diff}, vdf.DISCRIMINANT_256);
vdf.verify(challenge, ${diff}, proof, vdf.DISCRIMINANT_256);`;
  }

  function startElapsedTimer(labelEl) {
    const t0 = performance.now();
    labelEl.textContent = '0.0s';
    return setInterval(() => {
      labelEl.textContent = `${((performance.now() - t0) / 1000).toFixed(1)}s`;
    }, 100);
  }

  async function runDemo() {
    if (running) return;
    if (typeof vdf === 'undefined') {
      log('Library not loaded. Run npm run website:build and reload.', 'error');
      return;
    }

    running = true;
    runBtn.disabled = true;
    randomBtn.disabled = true;
    clearLog();
    resetSteps();

    try {
      setStep(1, 'active');
      log('Step 1 — Build the challenge (public input x).');
      const challenge = hexToBytes(challengeInput.value.trim());
      log(`Challenge = ${bytesToHex(challenge)} (${challenge.length} bytes)`);
      setStep(1, 'done', `${challenge.length} bytes · ${bytesToHex(challenge).slice(0, 24)}…`);

      setStep(2, 'active');
      const scheme = schemeSelect.value;
      const difficulty = Number(difficultySelect.value);
      log(`Step 2 — Configure ${scheme} VDF, ${BIT_SIZE}-bit discriminant, difficulty ${difficulty}.`);

      const Params =
        scheme === 'wesolowski' ? vdf.WesolowskiVDFParams : vdf.PietrzakVDFParams;
      const instance = new Params(BIT_SIZE).new();
      instance.checkDifficulty(difficulty);
      const discriminant = DISCS[BIT_SIZE]();

      if (scheme === 'pietrzak' && difficulty % 2 !== 0) {
        throw new Error('Pietrzak requires an even difficulty.');
      }

      setStep(2, 'done', `${scheme} · D = DISCRIMINANT_256`);

      setStep(3, 'active', 'running…');
      log('Step 3 — solve(): sequential squaring (this is the intentional delay).');
      log('The UI may freeze briefly — the CPU is doing real VDF work, not waiting on the network.');

      const elapsedEl = $('demo-step-3-time');
      timerId = startElapsedTimer(elapsedEl);

      const solveStart = performance.now();
      const proof = await instance.solve(challenge, difficulty, discriminant);
      const solveMs = Math.round(performance.now() - solveStart);
      clearInterval(timerId);
      timerId = null;

      setStep(3, 'done', `${solveMs} ms (slow path)`);
      log(`solve() finished in ${solveMs} ms.`);

      setStep(4, 'active');
      const preview = bytesToHex(proof).slice(0, 48);
      log(`Step 4 — Proof π received (${proof.length} bytes).`);
      setStep(4, 'done', `${proof.length} bytes · ${preview}…`);

      setStep(5, 'active');
      log('Step 5 — verify(): anyone checks π without redoing the delay.');
      const verifyStart = performance.now();
      instance.verify(challenge, difficulty, proof, discriminant);
      const verifyMs = Math.round(performance.now() - verifyStart);
      setStep(5, 'done', `${verifyMs} ms (fast path)`);
      log(`verify() finished in ${verifyMs} ms.`);

      const ratio = verifyMs > 0 ? (solveMs / verifyMs).toFixed(0) : '∞';
      setStep(6, 'done', 'Proof valid ✓');
      log(`Step 6 — Success. Verify was ~${ratio}× faster than solve.`, 'success');

      compareEl.hidden = false;
      const bar = document.createElement('div');
      bar.className = 'demo-compare-bar';
      const solveBar = document.createElement('div');
      solveBar.className = 'demo-compare-solve';
      solveBar.style.flex = String(solveMs);
      solveBar.innerHTML = '<span>solve ' + solveMs + ' ms</span>';
      const verifyBar = document.createElement('div');
      verifyBar.className = 'demo-compare-verify';
      verifyBar.style.flex = String(Math.max(verifyMs, 1));
      verifyBar.innerHTML = '<span>verify ' + verifyMs + ' ms</span>';
      bar.append(solveBar, verifyBar);
      const cap = document.createElement('p');
      cap.className = 'demo-compare-caption';
      cap.textContent =
        'Same proof on any machine — verify stays cheap; solve sets the delay.';
      compareEl.replaceChildren(bar, cap);
    } catch (err) {
      if (timerId) clearInterval(timerId);
      log(err.message || String(err), 'error');
      stepEls.forEach((el) => {
        if (el.classList.contains('active')) {
          el.classList.remove('active');
          el.classList.add('error');
        }
      });
    } finally {
      running = false;
      runBtn.disabled = false;
      randomBtn.disabled = false;
    }
  }

  randomBtn.addEventListener('click', randomChallenge);
  runBtn.addEventListener('click', runDemo);
  schemeSelect.addEventListener('change', updateCodePreview);
  difficultySelect.addEventListener('change', updateCodePreview);

  randomChallenge();
  updateCodePreview();
  resetSteps();
  log('Ready. Choose options and click “Run live demo”.', 'info');
})();
