/**
 * Site i18n: browser locale detection + manual switcher.
 * Loads strings from window.SITE_LOCALES (locales.js).
 */
(function () {
  const STORAGE_KEY = 'crypto-vdf-locale';
  const SUPPORTED = ['en', 'fr', 'es', 'ja'];

  function detectLocale() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED.includes(saved)) return saved;
    const langs = navigator.languages || [navigator.language || 'en'];
    for (const raw of langs) {
      const code = raw.toLowerCase().split('-')[0];
      if (SUPPORTED.includes(code)) return code;
    }
    return 'en';
  }

  let locale = detectLocale();

  function messages() {
    return window.SITE_LOCALES?.[locale] || window.SITE_LOCALES?.en || {};
  }

  /** @param {string} key dot.key */
  function t(key, vars) {
    let s = messages()[key];
    if (s == null) s = window.SITE_LOCALES?.en?.[key] ?? key;
    if (vars) {
      Object.keys(vars).forEach((k) => {
        s = s.replace(new RegExp(`\\{${k}\\}`, 'g'), String(vars[k]));
      });
    }
    return s;
  }

  function apply() {
    const m = messages();
    document.documentElement.lang = locale;
    if (m['meta.title']) document.title = m['meta.title'];
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && m['meta.description']) metaDesc.setAttribute('content', m['meta.description']);

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (key && m[key] != null) el.textContent = m[key];
    });

    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const key = el.getAttribute('data-i18n-html');
      if (key && m[key] != null) el.innerHTML = m[key];
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (key && m[key] != null) el.setAttribute('placeholder', m[key]);
    });

    document.querySelectorAll('[data-i18n-title]').forEach((el) => {
      const key = el.getAttribute('data-i18n-title');
      if (key && m[key] != null) el.setAttribute('title', m[key]);
    });

    document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
      const key = el.getAttribute('data-i18n-aria');
      if (key && m[key] != null) el.setAttribute('aria-label', m[key]);
    });

    const sel = document.getElementById('lang-select');
    if (sel) sel.value = locale;

    document.dispatchEvent(new CustomEvent('localechange', { detail: { locale } }));
  }

  function setLocale(code) {
    if (!SUPPORTED.includes(code)) return;
    locale = code;
    localStorage.setItem(STORAGE_KEY, code);
    apply();
  }

  window.SiteI18n = { t, getLocale: () => locale, setLocale, apply, SUPPORTED };

  function bindLangSelect() {
    const sel = document.getElementById('lang-select');
    if (sel && !sel.dataset.bound) {
      sel.dataset.bound = '1';
      sel.addEventListener('change', () => setLocale(sel.value));
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      bindLangSelect();
      apply();
    });
  } else {
    bindLangSelect();
    apply();
  }
})();
