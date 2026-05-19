/**
 * Interactive VDF demo — uses crypto-vdf browser bundle (global `vdf`).
 */
(function () {
  const DISCS = {
    256: () => vdf.DISCRIMINANT_256,
    512: () => vdf.DISCRIMINANT_512,
  };

  function t(key, vars) {
    if (window.SiteI18n) return window.SiteI18n.t(key, vars);
    return key;
  }

  /** Difficulty presets: long solve(), short verify() on typical hardware */
  const DIFFICULTY_PRESETS = {
    wesolowski: {
      256: [
        { v: 2048, key: 'demo.diff.w2048' },
        { v: 5000, key: 'demo.diff.w5000' },
        { v: 8000, key: 'demo.diff.w8000' },
        { v: 10000, key: 'demo.diff.w10000' },
      ],
      512: [
        { v: 2048, key: 'demo.diff.w2048' },
        { v: 4096, key: 'demo.diff.w4096' },
        { v: 6000, key: 'demo.diff.w6000' },
      ],
    },
    pietrzak: {
      256: [
        { v: 2048, key: 'demo.diff.p2048' },
        { v: 5000, key: 'demo.diff.p5000' },
        { v: 7000, key: 'demo.diff.p7000' },
      ],
      512: [
        { v: 2048, key: 'demo.diff.p2048' },
        { v: 4096, key: 'demo.diff.p4096' },
        { v: 6000, key: 'demo.diff.p6000' },
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
    list.forEach(({ v, key }) => {
      const opt = document.createElement('option');
      opt.value = String(v);
      opt.textContent = t(key);
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
    const time = new Date().toISOString().slice(11, 23);
    line.textContent = `[${time}] ${msg}`;
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
      throw new Error(t('demo.err.hex'));
    }
    if (clean.length === 0) throw new Error(t('demo.err.empty'));
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

  function schemeLabel(scheme) {
    return scheme === 'wesolowski' ? 'Wesolowski' : 'Pietrzak';
  }

  async function runDemo() {
    if (running) return;
    if (typeof vdf === 'undefined') {
      log(t('demo.libMissing'), 'error');
      return;
    }

    running = true;
    runBtn.disabled = true;
    randomBtn.disabled = true;
    clearLog();
    resetSteps();

    try {
      setStep(1, 'active');
      log(t('demo.log.s1'));
      const challenge = hexToBytes(challengeInput.value.trim());
      log(`Challenge = ${bytesToHex(challenge)} (${challenge.length} bytes)`);
      setStep(1, 'done', `${challenge.length} bytes · ${bytesToHex(challenge).slice(0, 24)}…`);

      setStep(2, 'active');
      const scheme = schemeSelect.value;
      const bits = getBitSize();
      const difficulty = Number(difficultySelect.value);
      const discName = bits === 512 ? 'DISCRIMINANT_512' : 'DISCRIMINANT_256';
      log(
        t('demo.log.s2', {
          scheme: schemeLabel(scheme),
          bits,
          diff: difficulty,
        })
      );

      const Params =
        scheme === 'wesolowski' ? vdf.WesolowskiVDFParams : vdf.PietrzakVDFParams;
      const instance = new Params(bits).new();
      instance.checkDifficulty(difficulty);
      const discriminant = DISCS[bits]();

      if (scheme === 'pietrzak' && difficulty % 2 !== 0) {
        throw new Error(t('demo.err.pietrzak'));
      }

      setStep(2, 'done', `${scheme} · ${discName}`);

      setStep(3, 'active', t('demo.running'));
      log(t('demo.log.s3a'));
      log(t('demo.log.s3b'));

      const elapsedEl = $('demo-step-3-time');
      timerId = startElapsedTimer(elapsedEl);

      const solveStart = performance.now();
      const proof = await instance.solve(challenge, difficulty, discriminant);
      const solveMs = Math.round(performance.now() - solveStart);
      clearInterval(timerId);
      timerId = null;

      setStep(3, 'done', t('demo.slowPath', { ms: solveMs }));
      log(t('demo.log.s3done', { ms: solveMs }));

      setStep(4, 'active');
      const preview = bytesToHex(proof).slice(0, 48);
      log(t('demo.log.s4', { bytes: proof.length }));
      setStep(4, 'done', `${proof.length} bytes · ${preview}…`);

      setStep(5, 'active');
      log(t('demo.log.s5a'));
      const verifyStart = performance.now();
      instance.verify(challenge, difficulty, proof, discriminant);
      const verifyMs = Math.round(performance.now() - verifyStart);
      setStep(5, 'done', t('demo.fastPath', { ms: verifyMs }));
      log(t('demo.log.s5done', { ms: verifyMs }));

      const ratio = verifyMs > 0 ? (solveMs / verifyMs).toFixed(0) : '∞';
      setStep(6, 'done', t('demo.valid', { ratio }));
      log(
        t('demo.log.s6', { solve: solveMs, verify: verifyMs, ratio }),
        'success'
      );
      if (solveMs < verifyMs * 3) {
        log(t('demo.log.tip'), 'info');
      }

      compareEl.hidden = false;
      const bar = document.createElement('div');
      bar.className = 'demo-compare-bar';
      const solveBar = document.createElement('div');
      solveBar.className = 'demo-compare-solve';
      solveBar.style.flex = String(solveMs);
      solveBar.innerHTML = `<span>${t('demo.solveBar', { ms: solveMs })}</span>`;
      const verifyBar = document.createElement('div');
      verifyBar.className = 'demo-compare-verify';
      verifyBar.style.flex = String(Math.max(verifyMs, 1));
      verifyBar.innerHTML = `<span>${t('demo.verifyBar', { ms: verifyMs })}</span>`;
      bar.append(solveBar, verifyBar);
      const cap = document.createElement('p');
      cap.className = 'demo-compare-caption';
      cap.textContent = t('demo.compareCap');
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

  function onLocaleChange() {
    refreshDifficultyOptions();
    updateCodePreview();
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
  document.addEventListener('localechange', onLocaleChange);

  randomChallenge();
  refreshDifficultyOptions(8000);
  updateCodePreview();
  resetSteps();
  log(t('demo.ready'), 'info');
})();
