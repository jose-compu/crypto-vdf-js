/**
 * Interactive VDF demo — uses crypto-vdf browser bundle (global `vdf`).
 */
(function () {
  const DISCS = {
    256: () => vdf.DISCRIMINANT_256,
    512: () => vdf.DISCRIMINANT_512,
  };

  /** Difficulty presets: long solve(), short verify() on typical hardware */
  const DIFFICULTY_PRESETS = {
    wesolowski: {
      256: [
        { v: 2048, label: '2,048 — moderate (~0.3–1s solve)' },
        { v: 5000, label: '5,000 — clear gap (~1–3s solve)' },
        { v: 8000, label: '8,000 — recommended demo (~2–5s solve)' },
        { v: 10000, label: '10,000 — max delay (~3–8s solve)' },
      ],
      512: [
        { v: 2048, label: '2,048 — moderate' },
        { v: 4096, label: '4,096 — recommended (~3–10s solve)' },
        { v: 6000, label: '6,000 — heavy (~5–15s solve)' },
      ],
    },
    pietrzak: {
      256: [
        { v: 2048, label: '2,048 — moderate (even)' },
        { v: 5000, label: '5,000 — clear gap (even)' },
        { v: 7000, label: '7,000 — max for Pietrzak in JS' },
      ],
      512: [
        { v: 2048, label: '2,048 — moderate (even)' },
        { v: 4096, label: '4,096 — recommended (even)' },
        { v: 6000, label: '6,000 — heavy (even)' },
      ],
    },
  };

  const $ = (id) => document.getElementById(id);
  const logEl = $('demo-log');
  const runBtn = $('demo-run');
  const randomBtn = $('demo-random-challenge');
  const challengeInput = $('demo-challenge');
  const schemeSelect = $('demo-scheme');
  const bitsSelect = $('demo-bits');
  const difficultySelect = $('demo-difficulty');
  const compareEl = $('demo-compare');

  function getBitSize() {
    return Number(bitsSelect.value);
  }

  function refreshDifficultyOptions(preferred) {
    const scheme = schemeSelect.value;
    const bits = getBitSize();
    const list = DIFFICULTY_PRESETS[scheme][bits];
    const prev = preferred ?? Number(difficultySelect.value);
    difficultySelect.innerHTML = '';
    list.forEach(({ v, label }) => {
      const opt = document.createElement('option');
      opt.value = String(v);
      opt.textContent = label;
      difficultySelect.appendChild(opt);
    });
    const values = list.map((o) => o.v);
    const pick = values.includes(prev) ? prev : values[Math.min(2, values.length - 1)];
    difficultySelect.value = String(pick);
  }

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
    const bits = getBitSize();
    const diff = difficultySelect.value;
    const disc = bits === 512 ? 'DISCRIMINANT_512' : 'DISCRIMINANT_256';
    const cls = scheme === 'wesolowski' ? 'WesolowskiVDFParams' : 'PietrzakVDFParams';
    $('demo-code').textContent = `const vdf = new vdf.${cls}(${bits}).new();
const challenge = new Uint8Array([/* your bytes */]);
const proof = await vdf.solve(challenge, ${diff}, vdf.${disc});
vdf.verify(challenge, ${diff}, proof, vdf.${disc});`;
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
      const bits = getBitSize();
      const difficulty = Number(difficultySelect.value);
      const discName = bits === 512 ? 'DISCRIMINANT_512' : 'DISCRIMINANT_256';
      log(`Step 2 — Configure ${scheme} VDF, ${bits}-bit discriminant, difficulty ${difficulty}.`);

      const Params =
        scheme === 'wesolowski' ? vdf.WesolowskiVDFParams : vdf.PietrzakVDFParams;
      const instance = new Params(bits).new();
      instance.checkDifficulty(difficulty);
      const discriminant = DISCS[bits]();

      if (scheme === 'pietrzak' && difficulty % 2 !== 0) {
        throw new Error('Pietrzak requires an even difficulty.');
      }

      setStep(2, 'done', `${scheme} · ${discName}`);

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
      setStep(6, 'done', `Valid ✓ · verify ~${ratio}× faster`);
      log(
        `Step 6 — Success. solve took ${solveMs} ms vs verify ${verifyMs} ms (~${ratio}× faster verification).`,
        'success'
      );
      if (solveMs < verifyMs * 3) {
        log(
          'Tip: pick a higher difficulty or 512-bit size to widen the solve vs verify gap on this device.',
          'info'
        );
      }

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
  schemeSelect.addEventListener('change', () => {
    refreshDifficultyOptions();
    updateCodePreview();
  });
  bitsSelect.addEventListener('change', () => {
    refreshDifficultyOptions();
    updateCodePreview();
  });
  difficultySelect.addEventListener('change', updateCodePreview);

  randomChallenge();
  refreshDifficultyOptions(8000);
  updateCodePreview();
  resetSteps();
  log('Ready. Choose options and click “Run live demo”.', 'info');
})();
