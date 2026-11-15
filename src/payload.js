(() => {
  'use strict';

  const VERSION = '3.5.0';
  const CSS = window.__SUM_CSS__ || '';

  if (window.__SUM_VERSION__ === VERSION && window.__SUM_APPLIED_CSS__ === CSS && document.getElementById('sum-root')) {
    if (typeof window.__SUM_REFRESH__ === 'function') {
      try { window.__SUM_REFRESH__(); } catch (error) { }
    }
    return 'ok';
  }
  window.__SUM_VERSION__ = VERSION;
  window.__SUM_APPLIED_CSS__ = CSS;

  const LS = {
    theme: 'sum.theme',
    accent: 'sum.accent',
    lang: 'sum.lang',
    mode: 'sum.mode',
    size: 'sum.size',
    css: 'sum.customCss',
    html: 'sum.customHtml',
    custom: 'sum.customPalette',
    open: 'sum.open',
    tab: 'sum.tab',
    scroll: 'sum.autoscroll',
    romanize: 'sum.romanize',
    languages: 'sum.languages.v1',
    trans: 'sum.translations.v2'
  };

  const readSetting = (key, fallback) => {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (error) {
      return fallback;
    }
  };

  const writeSetting = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (error) { }
  };

  const LANGUAGES = [
    ['en', 'English'], ['de', 'German'], ['fr', 'French'], ['es', 'Spanish'],
    ['pt', 'Portuguese'], ['it', 'Italian'], ['nl', 'Dutch'], ['pl', 'Polish'],
    ['ru', 'Russian'], ['uk', 'Ukrainian'], ['tr', 'Turkish'], ['sv', 'Swedish'],
    ['no', 'Norwegian'], ['da', 'Danish'], ['fi', 'Finnish'], ['cs', 'Czech'],
    ['sk', 'Slovak'], ['hu', 'Hungarian'], ['ro', 'Romanian'], ['el', 'Greek'],
    ['ja', 'Japanese'], ['ko', 'Korean'], ['zh-CN', 'Chinese (Simplified)'],
    ['zh-TW', 'Chinese (Traditional)'], ['ar', 'Arabic'], ['he', 'Hebrew'],
    ['hi', 'Hindi'], ['id', 'Indonesian'], ['vi', 'Vietnamese'], ['th', 'Thai']
  ];

  const THEMES = [
    {
      id: 'spotify', name: 'Spotify', accent: '#1ed760',
      vars: { '--background-base': '#121212', '--background-elevated-base': '#1f1f1f', '--background-elevated-highlight': '#2a2a2a', '--background-tinted-base': '#181818', '--background-tinted-highlight': '#242424', '--text-base': '#ffffff', '--text-subdued': '#b3b3b3', '--essential-base': '#1ed760', '--essential-bright-accent': '#1ed760' }
    },
    {
      id: 'midnight', name: 'Midnight', accent: '#8b5cf6',
      vars: { '--background-base': '#0b0b10', '--background-elevated-base': '#15151d', '--background-elevated-highlight': '#1c1c26', '--background-tinted-base': '#131319', '--background-tinted-highlight': '#1b1b25', '--text-base': '#f5f5f7', '--text-subdued': '#a5a5b4', '--essential-base': '#8b5cf6', '--essential-bright-accent': '#a78bfa' }
    },
    {
      id: 'amoled', name: 'AMOLED', accent: '#00e5a0',
      vars: { '--background-base': '#000000', '--background-elevated-base': '#0a0a0a', '--background-elevated-highlight': '#141414', '--background-tinted-base': '#070707', '--background-tinted-highlight': '#101010', '--text-base': '#ffffff', '--text-subdued': '#9a9a9a', '--essential-base': '#00e5a0', '--essential-bright-accent': '#5effc9' }
    },
    {
      id: 'neon', name: 'Neon', accent: '#ff2ea6',
      vars: { '--background-base': '#0a0612', '--background-elevated-base': '#170a24', '--background-elevated-highlight': '#221034', '--background-tinted-base': '#120a1c', '--background-tinted-highlight': '#1d0f2e', '--text-base': '#f7e9ff', '--text-subdued': '#c0a3d8', '--essential-base': '#ff2ea6', '--essential-bright-accent': '#ff7ac6' }
    },
    {
      id: 'ocean', name: 'Ocean', accent: '#22d3ee',
      vars: { '--background-base': '#04121d', '--background-elevated-base': '#0a2233', '--background-elevated-highlight': '#0f2c41', '--background-tinted-base': '#071a26', '--background-tinted-highlight': '#0d2534', '--text-base': '#e6f7ff', '--text-subdued': '#8fb6c9', '--essential-base': '#22d3ee', '--essential-bright-accent': '#67e8f9' }
    },
    {
      id: 'crimson', name: 'Crimson', accent: '#ff3b5c',
      vars: { '--background-base': '#120608', '--background-elevated-base': '#211013', '--background-elevated-highlight': '#2c161a', '--background-tinted-base': '#190b0e', '--background-tinted-highlight': '#251216', '--text-base': '#fff1f2', '--text-subdued': '#c9a1a6', '--essential-base': '#ff3b5c', '--essential-bright-accent': '#ff7d92' }
    },
    {
      id: 'aurora', name: 'Aurora', accent: '#34d399',
      vars: { '--background-base': '#06110f', '--background-elevated-base': '#0d201c', '--background-elevated-highlight': '#132b25', '--background-tinted-base': '#0a1916', '--background-tinted-highlight': '#10241f', '--text-base': '#ecfdf5', '--text-subdued': '#93b8ab', '--essential-base': '#34d399', '--essential-bright-accent': '#6ee7b7' }
    },
    {
      id: 'custom', name: 'Custom', accent: '#1ed760',
      vars: { '--background-base': '#121212', '--background-elevated-base': '#1f1f1f', '--background-elevated-highlight': '#2a2a2a', '--background-tinted-base': '#181818', '--background-tinted-highlight': '#242424', '--text-base': '#ffffff', '--text-subdued': '#b3b3b3', '--essential-base': '#1ed760', '--essential-bright-accent': '#1ed760' }
    }
  ];

  const state = {
    tab: readSetting(LS.tab, 'lyrics'),
    theme: readSetting(LS.theme, 'spotify'),
    accent: readSetting(LS.accent, ''),
    custom: readSetting(LS.custom, { base: '#121212', elevated: '#1f1f1f', text: '#ffffff', accent: '#1ed760' }),
    lang: readSetting(LS.lang, 'en'),
    mode: readSetting(LS.mode, 'both'),
    size: Number(readSetting(LS.size, 15)) || 15,
    autoscroll: readSetting(LS.scroll, true),
    romanize: readSetting(LS.romanize, true),
    romanized: {},
    languages: [],
    open: readSetting(LS.open, false),
    track: null,
    lines: [],
    active: -1,
    translated: {},
    translationState: 'idle',
    lyricsStatus: '',
    artist: null,
    artistStatus: '',
    artistFor: '',
    requestId: 0
  };

  const lyricCache = new Map();
  const artistCache = new Map();

  function resetInjectedSheets() {
    const registry = window.__SUM_SHEETS__;
    if (registry) {
      const stale = new Set(Object.values(registry));
      document.adoptedStyleSheets = document.adoptedStyleSheets.filter((sheet) => !stale.has(sheet));
    }
    document.adoptedStyleSheets = document.adoptedStyleSheets.filter((sheet) => {
      try {
        return !Array.from(sheet.cssRules).some((rule) => rule.cssText.indexOf('#sum-panel') >= 0 || rule.cssText.indexOf('#sum-root') >= 0);
      }
      catch (error) { return true; }
    });
    window.__SUM_SHEETS__ = {};
    document.querySelectorAll('style[id^="sum-style-"]').forEach((node) => node.remove());
  }

  function installSheet(id, css) {
    const registry = window.__SUM_SHEETS__ = window.__SUM_SHEETS__ || {};
    try {
      if (!registry[id]) {
        const sheet = new CSSStyleSheet();
        document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
        registry[id] = sheet;
      }
      registry[id].replaceSync(css);
    } catch (error) {
      let style = document.getElementById('sum-style-' + id);
      if (!style) {
        style = document.createElement('style');
        style.id = 'sum-style-' + id;
        document.head.appendChild(style);
      }
      style.textContent = css;
    }
  }

  function sanitizeCss(css) {
    return String(css || '')
      .replace(/@import[^;]*;?/gi, '')
      .replace(/javascript\s*:/gi, '')
      .replace(/expression\s*\(/gi, '')
      .replace(/url\s*\(\s*['"]?(?!data:)[^)]*\)/gi, '')
      .replace(/<\/?script[^>]*>/gi, '');
  }

  function sanitizeHtml(value) {
    try {
      const doc = new DOMParser().parseFromString('<div id="sum-html-root">' + String(value || '') + '</div>', 'text/html');
      const root = doc.getElementById('sum-html-root');
      if (!root) { return ''; }
      root.querySelectorAll('script,style,link,meta,iframe,object,embed,base,form').forEach((node) => node.remove());
      root.querySelectorAll('*').forEach((element) => {
        [...element.attributes].forEach((attribute) => {
          const name = attribute.name.toLowerCase();
          if (name.indexOf('on') === 0 || name === 'srcdoc') {
            element.removeAttribute(attribute.name);
          } else if ((name === 'href' || name === 'src' || name === 'xlink:href') && /^\s*javascript:/i.test(attribute.value)) {
            element.removeAttribute(attribute.name);
          }
        });
      });
      return root.innerHTML;
    } catch (error) {
      return '';
    }
  }

  const html = `
    <aside id="sum-panel" aria-label="Spotify Ultimate Mod panel">
      <header class="sum-header">
        <div class="sum-tabs">
          <button type="button" class="sum-tab" data-sum-tab="lyrics">Lyrics</button>
          <button type="button" class="sum-tab" data-sum-tab="artist">Artist</button>
          <button type="button" class="sum-tab" data-sum-tab="style">Style</button>
        </div>
        <button type="button" id="sum-close" class="sum-icon" aria-label="Close panel">&#10005;</button>
      </header>
      <div class="sum-body">
        <section class="sum-section" data-sum-section="lyrics">
          <div class="sum-toolbar">
            <select id="sum-lang" class="sum-select" aria-label="Translate lyrics to"></select>
            <select id="sum-mode" class="sum-select" aria-label="Lyrics display mode">
              <option value="both">Both languages</option>
              <option value="translated">Translated only</option>
              <option value="off">Original only</option>
            </select>
            <button type="button" id="sum-font-down" class="sum-icon" title="Smaller lyrics">A&#8722;</button>
            <button type="button" id="sum-font-up" class="sum-icon" title="Larger lyrics">A+</button>
          </div>
          <div class="sum-status" id="sum-lyrics-status">Waiting for playback&#8230;</div>
          <div class="sum-lyrics" id="sum-lyrics"></div>
        </section>
        <section class="sum-section" data-sum-section="artist">
          <div id="sum-artist" class="sum-artist"></div>
        </section>
        <section class="sum-section" data-sum-section="style">
          <div class="sum-label">Theme</div>
          <div class="sum-themes" id="sum-themes"></div>
          <div class="sum-row">
            <span class="sum-label">Accent</span>
            <input id="sum-accent" type="color" class="sum-color" aria-label="Accent colour">
          </div>
          <div class="sum-label">Custom colours</div>
          <div class="sum-row">
            <span class="sum-label">Base</span>
            <span class="sum-color-field"><input id="sum-base" type="color" class="sum-color" aria-label="Base colour"><code id="sum-base-hex" class="sum-hex"></code></span>
          </div>
          <div class="sum-row">
            <span class="sum-label">Surface</span>
            <span class="sum-color-field"><input id="sum-surface" type="color" class="sum-color" aria-label="Surface colour"><code id="sum-surface-hex" class="sum-hex"></code></span>
          </div>
          <div class="sum-row">
            <span class="sum-label">Text</span>
            <span class="sum-color-field"><input id="sum-text" type="color" class="sum-color" aria-label="Text colour"><code id="sum-text-hex" class="sum-hex"></code></span>
          </div>
          <div class="sum-row sum-actions">
            <button type="button" id="sum-theme-reset" class="sum-btn sum-ghost">Reset theme</button>
          </div>
          <div class="sum-row">
            <span class="sum-label">Auto-scroll lyrics</span>
            <input id="sum-scroll" type="checkbox" class="sum-check">
          </div>
          <div class="sum-row">
            <span class="sum-label">Pronunciation</span>
            <input id="sum-roman" type="checkbox" class="sum-check">
          </div>
          <div class="sum-label">Custom CSS</div>
          <textarea id="sum-css" class="sum-textarea" spellcheck="false" placeholder="/* Customise the interface */"></textarea>
          <div class="sum-row sum-actions">
            <button type="button" id="sum-css-apply" class="sum-btn">Apply</button>
            <button type="button" id="sum-css-reset" class="sum-btn sum-ghost">Reset</button>
          </div>
          <div class="sum-note">Custom CSS is sanitised: imports and remote URLs are removed.</div>
          <div class="sum-label">Custom HTML</div>
          <textarea id="sum-html" class="sum-textarea" spellcheck="false" placeholder="<!-- Add your own markup -->"></textarea>
          <div class="sum-row sum-actions">
            <button type="button" id="sum-html-apply" class="sum-btn">Apply</button>
            <button type="button" id="sum-html-reset" class="sum-btn sum-ghost">Reset</button>
          </div>
          <div class="sum-note">HTML is rendered in #sum-custom-html; scripts, iframes and inline handlers are removed.</div>
          <div class="sum-note">Translation and pronunciation modelled on <a class="sum-link" href="https://github.com/TheoreticallyBryChen/Lingo-lyrics" target="_blank" rel="noreferrer noopener">Lingo-lyrics</a> (independent implementation).</div>
        </section>
      </div>
      <footer class="sum-footer"><span>Ultimate Mod · LRCLIB · Wikipedia · Wikidata</span></footer>
    </aside>`;

  let refs = {};

  function mount() {
    const old = document.getElementById('sum-root');
    if (old) { old.remove(); }
    document.querySelectorAll('[data-sum-toggle="true"]').forEach((node) => node.remove());
    if (window.__SUM_TIMER__) { clearInterval(window.__SUM_TIMER__); }
    if (window.__SUM_MENU_OBSERVER__) { window.__SUM_MENU_OBSERVER__.disconnect(); window.__SUM_MENU_OBSERVER__ = null; }
    resetInjectedSheets();
    installSheet('base', CSS);

    const root = document.createElement('div');
    root.id = 'sum-root';
    root.className = 'sum-root';
    root.innerHTML = html;
    document.body.appendChild(root);

    refs = {
      root,
      panel: root.querySelector('#sum-panel'),
      close: root.querySelector('#sum-close'),
      tabs: [...root.querySelectorAll('.sum-tab')],
      sections: [...root.querySelectorAll('[data-sum-section]')],
      lang: root.querySelector('#sum-lang'),
      mode: root.querySelector('#sum-mode'),
      fontUp: root.querySelector('#sum-font-up'),
      fontDown: root.querySelector('#sum-font-down'),
      status: root.querySelector('#sum-lyrics-status'),
      lyrics: root.querySelector('#sum-lyrics'),
      artist: root.querySelector('#sum-artist'),
      themes: root.querySelector('#sum-themes'),
      accent: root.querySelector('#sum-accent'),
      base: root.querySelector('#sum-base'),
      baseHex: root.querySelector('#sum-base-hex'),
      surface: root.querySelector('#sum-surface'),
      surfaceHex: root.querySelector('#sum-surface-hex'),
      text: root.querySelector('#sum-text'),
      textHex: root.querySelector('#sum-text-hex'),
      themeReset: root.querySelector('#sum-theme-reset'),
      scroll: root.querySelector('#sum-scroll'),
      roman: root.querySelector('#sum-roman'),
      css: root.querySelector('#sum-css'),
      cssApply: root.querySelector('#sum-css-apply'),
      cssReset: root.querySelector('#sum-css-reset'),
      html: root.querySelector('#sum-html'),
      htmlApply: root.querySelector('#sum-html-apply'),
      htmlReset: root.querySelector('#sum-html-reset')
    };

    populateLanguages(LANGUAGES);
    refreshLanguages();
    refs.mode.value = state.mode;
    refs.scroll.checked = state.autoscroll;
    refs.roman.checked = state.romanize;
    refs.css.value = readSetting(LS.css, '');
    refs.html.value = readSetting(LS.html, '');
    refs.accent.value = state.accent || themeById(state.theme).accent;

    for (const theme of THEMES) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'sum-theme';
      button.dataset.sumTheme = theme.id;
      button.innerHTML = `<span class="sum-theme-dot" style="background:${theme.accent}"></span><span>${theme.name}</span>`;
      button.addEventListener('click', () => {
        state.theme = theme.id;
        state.accent = '';
        writeSetting(LS.theme, theme.id);
        writeSetting(LS.accent, '');
        refs.accent.value = theme.accent;
        applyTheme();
      });
      refs.themes.appendChild(button);
    }

    refs.close.addEventListener('click', () => setOpen(false));
    refs.tabs.forEach((tab) => tab.addEventListener('click', () => setTab(tab.dataset.sumTab)));
    refs.lang.addEventListener('change', () => {
      state.lang = refs.lang.value;
      writeSetting(LS.lang, state.lang);
      state.translated = {};
      state.romanized = {};
      translateLines();
      renderLyrics();
    });
    refs.mode.addEventListener('change', () => {
      state.mode = refs.mode.value;
      writeSetting(LS.mode, state.mode);
      renderLyrics();
    });
    refs.fontUp.addEventListener('click', () => changeFont(1));
    refs.fontDown.addEventListener('click', () => changeFont(-1));
    refs.scroll.addEventListener('change', () => {
      state.autoscroll = refs.scroll.checked;
      writeSetting(LS.scroll, state.autoscroll);
    });
    refs.roman.addEventListener('change', () => {
      state.romanize = refs.roman.checked;
      writeSetting(LS.romanize, state.romanize);
      renderLyrics();
    });
    refs.accent.addEventListener('input', () => {
      state.accent = refs.accent.value;
      writeSetting(LS.accent, state.accent);
      applyTheme();
    });
    refs.themeReset.addEventListener('click', () => {
      const theme = THEMES[0];
      state.theme = theme.id;
      state.accent = '';
      state.custom = {
        base: theme.vars['--background-base'],
        elevated: theme.vars['--background-elevated-base'],
        text: theme.vars['--text-base'],
        accent: theme.accent
      };
      writeSetting(LS.theme, state.theme);
      writeSetting(LS.accent, '');
      writeSetting(LS.custom, state.custom);
      applyTheme();
    });
    const bindPalette = (input, key) => {
      input.addEventListener('input', () => {
        if (state.theme !== 'custom') {
          const current = themeById(state.theme);
          state.custom = {
            base: current.vars['--background-base'],
            elevated: current.vars['--background-elevated-base'],
            text: current.vars['--text-base'],
            accent: state.accent || current.accent
          };
          state.theme = 'custom';
          writeSetting(LS.theme, state.theme);
        }
        state.custom[key] = input.value;
        writeSetting(LS.custom, state.custom);
        applyTheme();
      });
    };
    bindPalette(refs.base, 'base');
    bindPalette(refs.surface, 'elevated');
    bindPalette(refs.text, 'text');
    refs.cssApply.addEventListener('click', () => {
      writeSetting(LS.css, refs.css.value);
      applyCustomCss(refs.css.value);
    });
    refs.cssReset.addEventListener('click', () => {
      refs.css.value = '';
      writeSetting(LS.css, '');
      installSheet('custom', '');
    });
    refs.htmlApply.addEventListener('click', () => {
      writeSetting(LS.html, refs.html.value);
      applyCustomHtml(refs.html.value);
    });
    refs.htmlReset.addEventListener('click', () => {
      refs.html.value = '';
      writeSetting(LS.html, '');
      applyCustomHtml('');
    });

    applyTheme();
    applyCustomCss(readSetting(LS.css, ''));
    applyCustomHtml(readSetting(LS.html, ''));
    setTab(state.tab, true);
    setOpen(state.open, true);
    ensurePlayerButton();

    window.__SUM_MENU_OBSERVER__ = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (!(node instanceof HTMLElement)) { continue; }
          if (node.matches('[role="menu"]')) { decorateMenu(node); }
          if (node.querySelectorAll) { node.querySelectorAll('[role="menu"]').forEach(decorateMenu); }
        }
      }
    });
    window.__SUM_MENU_OBSERVER__.observe(document.body, { childList: true, subtree: true });
    decorateAllMenus();
  }

  function ensurePlayerButton() {
    let button = document.querySelector('[data-sum-toggle="true"]');
    if (button) { syncToggleState(); return; }

    const lyricsButton = document.querySelector('[data-testid="lyrics-button"]');
    if (lyricsButton && lyricsButton.parentElement) {
      button = lyricsButton.cloneNode(true);
      button.removeAttribute('data-testid');
      button.setAttribute('id', 'sum-toggle');
      button.setAttribute('data-sum-toggle', 'true');
      button.setAttribute('aria-label', 'Spotify Ultimate Mod');
      button.setAttribute('title', 'Spotify Ultimate Mod (Ctrl+Shift+U)');
      button.classList.remove('sum-fallback');
      const svg = button.querySelector('svg');
      if (svg) {
        svg.setAttribute('viewBox', '0 0 16 16');
        svg.innerHTML = '<path d="M2.6 2.1h10.8a.6.6 0 0 1 .6.6v7.3a.6.6 0 0 1-.6.6H7.1L4 13.4a.6.6 0 0 1-1-.5v-2.3h-.4a.6.6 0 0 1-.6-.6V2.7a.6.6 0 0 1 .6-.6zm1.2 2.3v1.1h8.4V4.4zm0 2.4v1.1h5.8V6.8z"/>';
      }
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        setOpen(!state.open);
      });
      lyricsButton.insertAdjacentElement('afterend', button);
      syncToggleState();
      return;
    }

    if (document.getElementById('sum-toggle')) { return; }
    const fallback = document.createElement('button');
    fallback.type = 'button';
    fallback.id = 'sum-toggle';
    fallback.className = 'sum-fallback';
    fallback.setAttribute('data-sum-toggle', 'true');
    fallback.setAttribute('aria-label', 'Spotify Ultimate Mod');
    fallback.textContent = 'L';
    fallback.addEventListener('click', () => setOpen(!state.open));
    refs.root.appendChild(fallback);
    syncToggleState();
  }

  function syncToggleState() {
    const button = document.querySelector('[data-sum-toggle="true"]');
    if (!button) { return; }
    button.setAttribute('aria-pressed', state.open ? 'true' : 'false');
    button.dataset.active = state.open ? 'true' : 'false';
    button.style.color = state.open ? 'var(--essential-bright-accent, #1ed760)' : '';
  }

  function closeSpotifyMenus() {
    ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach((type) => {
      try {
        const EventCtor = type.indexOf('pointer') === 0 ? PointerEvent : MouseEvent;
        document.body.dispatchEvent(new EventCtor(type, { bubbles: true, clientX: 8, clientY: 8 }));
      } catch (error) { }
    });
  }

  function decorateMenu(menu) {
    try {
      if (!menu || menu.getAttribute('data-sum-enhanced') === 'true') { return; }
      const items = menu.querySelectorAll(':scope > li[role="presentation"]');
      if (!items.length) { return; }
      const entry = items[0].cloneNode(true);
      const button = entry.querySelector('[role="menuitem"]');
      if (!button) { return; }
      entry.setAttribute('data-sum-menu', 'true');
      button.removeAttribute('aria-haspopup');
      button.removeAttribute('aria-expanded');
      button.setAttribute('aria-label', 'Ultimate Mod settings');
      const label = button.querySelector('[data-encore-id="text"]');
      if (label) {
        label.textContent = 'Ultimate Mod settings';
        const labelWrap = label.parentElement;
        [...button.children].forEach((child) => { if (child !== labelWrap) { child.remove(); } });
      } else {
        button.textContent = 'Ultimate Mod settings';
      }
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        setTab('style');
        setOpen(true);
        closeSpotifyMenus();
      });
      menu.insertBefore(entry, menu.firstElementChild);
      menu.setAttribute('data-sum-enhanced', 'true');
    } catch (error) { }
  }

  function decorateAllMenus() {
    document.querySelectorAll('[role="menu"]').forEach(decorateMenu);
  }

  function populateLanguages(list) {
    if (!refs.lang) { return; }
    refs.lang.textContent = '';
    const seen = new Set();
    for (const entry of list) {
      const code = Array.isArray(entry) ? entry[0] : entry.code;
      const label = Array.isArray(entry) ? entry[1] : entry.name;
      if (!code || seen.has(code)) { continue; }
      seen.add(code);
      const option = document.createElement('option');
      option.value = code;
      option.textContent = label;
      refs.lang.appendChild(option);
    }
    if (seen.has(state.lang)) { refs.lang.value = state.lang; }
  }

  async function refreshLanguages() {
    const cached = readSetting(LS.languages, null);
    let list = null;
    if (cached && cached.list && cached.list.length > 40 && (Date.now() - cached.at) < 604800000) {
      list = cached.list;
    }
    else {
      try {
        const data = await fetchJson('https://translate.googleapis.com/translate_a/l?client=gtx&alpha=true&hl=en');
        const map = data.tl || {};
        list = Object.keys(map)
          .map((code) => ({ code, name: map[code] }))
          .sort((a, b) => String(a.name).localeCompare(String(b.name)));
        if (list.length > 40) {
          writeSetting(LS.languages, { at: Date.now(), list });
        }
        else { list = null; }
      }
      catch (error) { list = null; }
    }
    if (!list || !refs.lang) { return; }
    state.languages = list;
    populateLanguages(list);
  }

  function themeById(id) {
    return THEMES.find((theme) => theme.id === id) || THEMES[0];
  }

  function parseHexColor(value) {
    const match = /^#?([0-9a-f]{6})$/i.exec(String(value || '').trim());
    if (!match) { return null; }
    return [0, 2, 4].map((index) => parseInt(match[1].slice(index, index + 2), 16));
  }

  function toHexColor(rgb) {
    return '#' + rgb.map((value) => Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, '0')).join('');
  }

  function mixColor(from, to, amount) {
    const a = parseHexColor(from) || [18, 18, 18];
    const b = parseHexColor(to) || [255, 255, 255];
    return toHexColor(a.map((value, index) => value + (b[index] - value) * amount));
  }

  function customVars(palette) {
    const base = palette.base || '#121212';
    const elevated = palette.elevated || '#1f1f1f';
    const text = palette.text || '#ffffff';
    const accent = palette.accent || '#1ed760';
    return {
      '--background-base': base,
      '--background-elevated-base': elevated,
      '--background-elevated-highlight': mixColor(elevated, '#ffffff', 0.08),
      '--background-tinted-base': mixColor(base, elevated, 0.5),
      '--background-tinted-highlight': mixColor(elevated, '#ffffff', 0.14),
      '--text-base': text,
      '--text-subdued': mixColor(text, base, 0.42),
      '--essential-base': accent,
      '--essential-bright-accent': accent
    };
  }

  function syncThemeFields(vars, accent) {
    const write = (input, hexLabel, value) => {
      if (input) { input.value = /^#[0-9a-f]{6}$/i.test(value) ? value : '#000000'; }
      if (hexLabel) { hexLabel.textContent = String(value || '').toUpperCase(); }
    };
    write(refs.base, refs.baseHex, vars['--background-base']);
    write(refs.surface, refs.surfaceHex, vars['--background-elevated-base']);
    write(refs.text, refs.textHex, vars['--text-base']);
    if (refs.accent) { refs.accent.value = /^#[0-9a-f]{6}$/i.test(accent) ? accent : '#1ed760'; }
  }

  function applyTheme() {
    const theme = themeById(state.theme);
    const vars = theme.id === 'custom' ? customVars(state.custom) : theme.vars;
    const accent = state.accent || theme.accent;
    const root = document.documentElement;
    for (const [name, value] of Object.entries(vars)) {
      root.style.setProperty(name, value);
    }
    root.style.setProperty('--essential-base', accent);
    root.style.setProperty('--essential-bright-accent', accent);
    root.style.setProperty('--sum-accent', accent);
    root.style.setProperty('--sum-bg-base', vars['--background-base']);
    root.style.setProperty('--sum-bg-elevated', vars['--background-elevated-base']);
    root.style.setProperty('--sum-bg-elevated-highlight', vars['--background-elevated-highlight']);
    root.style.setProperty('--sum-bg-tinted', vars['--background-tinted-base']);
    root.style.setProperty('--sum-bg-tinted-highlight', vars['--background-tinted-highlight']);
    root.style.setProperty('--sum-text', vars['--text-base']);
    root.style.setProperty('--sum-text-subdued', vars['--text-subdued']);
    root.setAttribute('data-sum-theme', theme.id);
    syncThemeFields(vars, accent);
    if (refs.themes) {
      refs.themes.querySelectorAll('.sum-theme').forEach((button) => {
        button.classList.toggle('is-active', button.dataset.sumTheme === theme.id);
      });
    }
  }

  function applyCustomCss(value) {
    const css = typeof value === 'string' ? value : refs.css.value;
    installSheet('custom', sanitizeCss(css));
  }

  function applyCustomHtml(value) {
    const markup = typeof value === 'string' ? value : (refs.html ? refs.html.value : '');
    let host = document.getElementById('sum-custom-html');
    if (!host) {
      host = document.createElement('div');
      host.id = 'sum-custom-html';
      document.body.appendChild(host);
    }
    host.innerHTML = sanitizeHtml(markup);
  }

  function changeFont(delta) {
    state.size = Math.min(28, Math.max(11, state.size + delta));
    writeSetting(LS.size, state.size);
    if (refs.lyrics) { refs.lyrics.style.setProperty('--sum-lyric-size', state.size + 'px'); }
  }

  function setOpen(open, immediate) {
    state.open = Boolean(open);
    writeSetting(LS.open, state.open);
    if (!refs.panel) { return; }
    refs.panel.classList.toggle('is-open', state.open);
    syncToggleState();
    if (state.open && !immediate) {
      if (state.tab === 'artist') { loadArtistForCurrent(); }
      if (state.tab === 'lyrics') { updateActive(true); }
    }
  }

  function setTab(tab, immediate) {
    state.tab = tab;
    writeSetting(LS.tab, tab);
    if (!refs.tabs) { return; }
    refs.tabs.forEach((button) => button.classList.toggle('is-active', button.dataset.sumTab === tab));
    refs.sections.forEach((section) => section.classList.toggle('is-active', section.dataset.sumSection === tab));
    if (tab === 'artist' && !immediate) { loadArtistForCurrent(); }
    if (tab === 'lyrics' && !immediate) { updateActive(true); }
  }

  function parseClock(text) {
    if (!text) { return 0; }
    const parts = String(text).trim().split(':').map(Number);
    if (parts.some((value) => Number.isNaN(value))) { return 0; }
    if (parts.length === 3) { return parts[0] * 3600 + parts[1] * 60 + parts[2]; }
    if (parts.length === 2) { return parts[0] * 60 + parts[1]; }
    return parts[0] || 0;
  }

  function readTrack() {
    const widget = document.querySelector('[data-testid="now-playing-widget-v2"], [data-testid="now-playing-widget"]');
    if (!widget) { return null; }
    const titleLink = widget.querySelector('[data-testid="context-item-link"]');
    const title = titleLink ? titleLink.textContent.trim() : '';
    if (!title) { return null; }
    const artistLinks = [...widget.querySelectorAll('a[href*="/artist/"]')]
      .map((link) => link.textContent.trim())
      .filter((name) => name && name !== title);
    const artists = [...new Set(artistLinks)];
    const coverImg = widget.querySelector('[data-testid="cover-art-image"]') || widget.querySelector('img');
    const positionEl = document.querySelector('[data-testid="playback-position"]');
    const durationEl = document.querySelector('[data-testid="playback-duration"]');
    const playBtn = document.querySelector('[data-testid="control-button-playpause"]');
    const key = title + '|' + artists.join(', ');
    return {
      key,
      title,
      artists,
      artist: artists.join(', ') || 'Unknown artist',
      cover: coverImg ? coverImg.src : '',
      position: parseClock(positionEl ? positionEl.textContent : ''),
      duration: parseClock(durationEl ? durationEl.textContent : ''),
      playing: playBtn ? (playBtn.getAttribute('aria-label') || '').toLowerCase().includes('pause') : false
    };
  }

  function updateTrackLabel() {
    if (!refs.trackLabel) { return; }
    refs.trackLabel.textContent = state.track
      ? state.track.title + ' — ' + state.track.artist
      : 'No track playing';
  }

  function syncTrack() {
    const track = readTrack();
    if (!track) {
      state.track = null;
      if (refs.status && !state.lines.length) {
        refs.status.textContent = 'Start a track in Spotify to load lyrics.';
      }
      updateTrackLabel();
      return;
    }
    const changed = !state.track || state.track.key !== track.key;
    const previousDuration = state.track ? state.track.duration : 0;
    state.track = track;
    updateTrackLabel();
    if (changed || (track.duration && track.duration !== previousDuration)) {
      loadLyrics(track);
      if (state.tab === 'artist') { loadArtistForCurrent(); }
    }
  }

  function stripMeta(line) {
    return line.replace(/^\[[a-z]+:[^\]]*\]\s*/i, '');
  }

  function parseLrc(raw) {
    const lines = [];
    let offset = 0;
    const text = String(raw || '');
    const offsetMatch = text.match(/\[offset:\s*([+-]?\d+)\s*\]/i);
    if (offsetMatch) { offset = Number(offsetMatch[1]) / 1000; }
    for (const rawLine of text.split(/\r?\n/)) {
      const stamps = [...rawLine.matchAll(/\[(\d{1,2}):(\d{2})(?:[.:](\d{1,3}))?\]/g)];
      if (!stamps.length) { continue; }
      const content = rawLine.replace(/\[[^\]]*\]/g, '').trim();
      if (!content) { continue; }
      for (const stamp of stamps) {
        const minutes = Number(stamp[1]);
        const seconds = Number(stamp[2]);
        const fraction = stamp[3] ? Number(stamp[3]) / Math.pow(10, stamp[3].length) : 0;
        lines.push({ time: minutes * 60 + seconds + fraction + offset, text: content });
      }
    }
    lines.sort((a, b) => a.time - b.time);
    return lines;
  }

  function normalizeName(value) {
    return String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/\s*[([].*?[)\]]\s*/g, ' ').replace(/[^a-z0-9]+/g, ' ').trim();
  }

  async function fetchJson(url) {
    const response = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!response.ok) { throw new Error('HTTP ' + response.status); }
    return response.json();
  }

  async function loadLyrics(track) {
    const requestId = ++state.requestId;
    state.lines = [];
    state.active = -1;
    state.translated = {};
    state.romanized = {};
    state.translationState = 'idle';
    const cached = lyricCache.get(track.key);
    if (cached) {
      state.lines = cached.lines;
      state.lyricsStatus = cached.status;
      renderLyrics();
      updateActive(true);
      return;
    }
    if (refs.status) { refs.status.textContent = 'Loading lyrics…'; }
    try {
      const params = new URLSearchParams({
        track_name: track.title,
        artist_name: track.artist,
        duration: String(track.duration || '')
      });
      let record = null;
      try {
        record = await fetchJson('https://lrclib.net/api/get?' + params.toString());
      } catch (error) {
        record = null;
      }
      const titleMatches = record && normalizeName(record.trackName) === normalizeName(track.title);
      const artistMatches = record && normalizeName(record.artistName).includes(normalizeName(track.artists[0] || track.artist));
      const usable = record && (record.syncedLyrics || record.plainLyrics) && !record.instrumental;
      if (!usable || !titleMatches || !artistMatches) {
        const list = await fetchJson('https://lrclib.net/api/search?' + new URLSearchParams({
          track_name: track.title,
          artist_name: track.artist
        }).toString());
        const candidates = Array.isArray(list) ? list.filter((item) => item && !item.instrumental) : [];
        const scored = candidates.map((item) => {
          let score = 0;
          if (normalizeName(item.trackName) === normalizeName(track.title)) { score += 4; }
          if (normalizeName(item.artistName).includes(normalizeName(track.artists[0] || track.artist))) { score += 4; }
          if (item.syncedLyrics) { score += 2; }
          if (item.duration && track.duration) { score -= Math.min(3, Math.abs(item.duration - track.duration) / 10); }
          return { item, score };
        }).sort((a, b) => b.score - a.score);
        record = scored.length ? scored[0].item : null;
      }
      if (requestId !== state.requestId) { return; }
      if (!record) {
        state.lines = [];
        state.lyricsStatus = 'No lyrics were found for this track.';
        lyricCache.set(track.key, { lines: [], status: state.lyricsStatus });
        renderLyrics();
        return;
      }
      if (record.instrumental) {
        state.lines = [];
        state.lyricsStatus = 'Instrumental track — no lyrics to display.';
        lyricCache.set(track.key, { lines: [], status: state.lyricsStatus });
        renderLyrics();
        return;
      }
      if (record.syncedLyrics) {
        state.lines = parseLrc(record.syncedLyrics);
        state.lyricsStatus = 'Synced lyrics from LRCLIB';
      } else if (record.plainLyrics) {
        state.lines = record.plainLyrics.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
          .map((line, index) => ({ time: -1, index, text: line }));
        state.lyricsStatus = 'Lyrics are not time-synced for this track';
      }
      if (!state.lines.length) {
        state.lyricsStatus = 'No lyrics were found for this track.';
      }
      lyricCache.set(track.key, { lines: state.lines, status: state.lyricsStatus });
      renderLyrics();
      updateActive(true);
      if (state.lang && state.mode !== 'off') { translateLines(); }
    } catch (error) {
      if (requestId !== state.requestId) { return; }
      state.lines = [];
      state.lyricsStatus = 'Lyrics are unavailable right now (' + error.message + ').';
      renderLyrics();
    }
  }

  function renderLyrics() {
    if (!refs.lyrics) { return; }
    refs.lyrics.style.setProperty('--sum-lyric-size', state.size + 'px');
    refs.lyrics.classList.toggle('mode-translated', state.mode === 'translated');
    refs.lyrics.classList.toggle('mode-both', state.mode === 'both');
    if (refs.status) {
      let status = state.lyricsStatus || 'Waiting for playback…';
      if (state.mode !== 'off' && state.translationState === 'working') { status += ' · translating…'; }
      if (state.mode !== 'off' && state.translationState === 'partial') { status += ' · some lines could not be translated'; }
      refs.status.textContent = status;
    }
    refs.lyrics.textContent = '';
    if (!state.lines.length) { return; }

    const fragment = document.createDocumentFragment();
    state.lines.forEach((line, index) => {
      const row = document.createElement('div');
      row.className = 'sum-line';
      row.dataset.index = String(index);
      const original = document.createElement('div');
      original.className = 'sum-line-text';
      original.textContent = line.text;
      row.appendChild(original);
      const romanization = state.romanized[line.text];
      if (state.romanize && romanization && state.mode !== 'translated') {
        const roman = document.createElement('div');
        roman.className = 'sum-line-roman';
        roman.textContent = romanization;
        row.appendChild(roman);
      }
      const translation = state.translated[line.text];
      if (translation && state.mode !== 'off') {
        const translated = document.createElement('div');
        translated.className = 'sum-line-trans';
        translated.textContent = translation;
        row.appendChild(translated);
      }
      fragment.appendChild(row);
    });
    refs.lyrics.appendChild(fragment);
    updateActive(true);
  }

  function updateActive(force) {
    if (!refs.lyrics || !state.track) { return; }
    const position = parseClock((document.querySelector('[data-testid="playback-position"]') || {}).textContent || '') || state.track.position;
    let index = -1;
    for (let i = 0; i < state.lines.length; i++) {
      if (state.lines[i].time >= 0 && state.lines[i].time <= position + 0.15) { index = i; } else if (state.lines[i].time > position) { break; }
    }
    if (index === state.active && !force) { return; }
    state.active = index;
    const rows = refs.lyrics.querySelectorAll('.sum-line');
    rows.forEach((row, i) => row.classList.toggle('is-active', i === index));
    if (state.autoscroll && index >= 0 && rows[index]) {
      rows[index].scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }

  async function translateText(text, lang) {
    const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=' + encodeURIComponent(lang) +
      '&dt=t&dt=rm&q=' + encodeURIComponent(text);
    const response = await fetch(url);
    if (!response.ok) { throw new Error('HTTP ' + response.status); }
    const data = await response.json();
    const segments = data[0] || [];
    const translated = segments.filter((part) => part && part[0]).map((part) => part[0]).join('');
    const romanized = segments.filter((part) => part && !part[0] && part[3]).map((part) => part[3]).join('');
    return { text: translated, romanization: romanized };
  }

  window.__SUM_TRANSLATE__ = (text, lang) => translateText(text, lang || state.lang);

  async function translateLines() {
    if (!state.lines.length || state.mode === 'off') { return; }
    const requestId = state.requestId;
    const lang = state.lang;
    const store = readSetting(LS.trans, {}) || {};
    const targets = state.lines.filter((line) => line.text).slice(0, 120);
    state.translationState = 'working';
    let rendered = 0;
    let changed = false;
    for (const line of targets) {
      if (requestId !== state.requestId) { return; }
      const cacheKey = lang + '|' + line.text;
      const cached = store[cacheKey];
      if (cached) {
        const entry = typeof cached === 'string' ? { text: cached, romanization: '' } : cached;
        state.translated[line.text] = entry.text;
        if (entry.romanization) { state.romanized[line.text] = entry.romanization; }
        changed = true;
        continue;
      }
      try {
        const result = await translateText(line.text, lang);
        if (result.text && result.text.trim() && result.text.trim().toLowerCase() !== line.text.trim().toLowerCase()) {
          state.translated[line.text] = result.text;
          if (result.romanization) { state.romanized[line.text] = result.romanization; }
          store[cacheKey] = { text: result.text, romanization: result.romanization || '' };
          changed = true;
          rendered++;
          if (rendered % 4 === 0) { renderLyrics(); }
        }
      } catch (error) {
        state.translationState = 'error';
      }
      await new Promise((resolve) => setTimeout(resolve, 90));
    }
    if (requestId !== state.requestId) { return; }
    const keys = Object.keys(store);
    if (keys.length > 2500) {
      for (const key of keys.slice(0, keys.length - 2500)) { delete store[key]; }
    }
    writeSetting(LS.trans, store);
    state.translationState = state.translationState === 'error' ? 'partial' : 'ready';
    if (changed) { renderLyrics(); }
  }

  function claimValue(entity, property) {
    const claims = entity.claims && entity.claims[property];
    if (!claims || !claims.length) { return null; }
    const mainsnak = claims[0].mainsnak;
    if (!mainsnak || !mainsnak.datavalue) { return null; }
    return mainsnak.datavalue.value;
  }

  function formatDate(value) {
    const time = value && value.time ? String(value.time).replace(/^\+/, '') : '';
    const match = time.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!match) { return ''; }
    if (value.precision && value.precision < 11) { return match[1]; }
    return match[1] + '-' + match[2] + '-' + match[3];
  }

  async function resolveLabels(ids) {
    const unique = [...new Set(ids.filter(Boolean))].slice(0, 30);
    if (!unique.length) { return {}; }
    const url = 'https://www.wikidata.org/w/api.php?action=wbgetentities&ids=' + encodeURIComponent(unique.join('|')) +
      '&props=labels&languages=en&format=json&origin=*';
    const data = await fetchJson(url);
    const labels = {};
    for (const id of unique) {
      const entity = data.entities && data.entities[id];
      labels[id] = entity && entity.labels && (entity.labels.en ? entity.labels.en.value : Object.values(entity.labels)[0] && Object.values(entity.labels)[0].value) || id;
    }
    return labels;
  }

  async function findWikipedia(name) {
    const target = normalizeName(name);
    const queries = [name, name + ' singer', name + ' musician', name + ' band'];
    for (const query of queries) {
      try {
        const result = await fetchJson('https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=' +
          encodeURIComponent(query) + '&srlimit=6&format=json&origin=*');
        const hits = (result.query && result.query.search) || [];
        const ordered = hits.slice().sort((a, b) => {
          const rank = (title) => {
            const normalized = normalizeName(title);
            if (normalized === target) { return 0; }
            if (normalized.indexOf(target) >= 0) { return 1; }
            return 2;
          };
          return rank(a.title) - rank(b.title);
        });
        for (const hit of ordered.slice(0, 3)) {
          if (normalizeName(hit.title).indexOf(target) < 0) { continue; }
          try {
            const summary = await fetchJson('https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(hit.title));
            if (summary && summary.type !== 'disambiguation' && summary.extract) {
              return { title: hit.title, summary };
            }
          } catch (error) { }
        }
      } catch (error) { }
    }
    return null;
  }

  async function loadArtistForCurrent() {
    const track = state.track;
    if (!track) { return; }
    if (state.artistFor === track.artists[0] && state.artist) { return; }
    const name = track.artists[0] || track.artist;
    if (!name) { return; }
    state.artistFor = name;
    const memory = artistCache.get(name);
    if (memory) { state.artist = memory; renderArtist(); return; }
    if (refs.artist) { refs.artist.innerHTML = '<div class="sum-status">Loading artist information…</div>'; }
    try {
      const wiki = await findWikipedia(name);
      const summary = wiki ? wiki.summary : null;
      let wikidata = null;
      let labels = {};
      try {
        const search = await fetchJson('https://www.wikidata.org/w/api.php?action=wbsearchentities&search=' +
          encodeURIComponent(name) + '&language=en&format=json&origin=*');
        const qid = search.search && search.search[0] && search.search[0].id;
        if (qid) {
          const entityData = await fetchJson('https://www.wikidata.org/w/api.php?action=wbgetentities&ids=' + qid +
            '&props=claims|labels&languages=en&format=json&origin=*');
          const entity = entityData.entities && entityData.entities[qid];
          if (entity) {
            const ids = [];
            for (const property of ['P19', 'P27', 'P106', 'P136', 'P264']) {
              const value = claimValue(entity, property);
              if (property === 'P106' && entity.claims.P106) {
                for (const claim of entity.claims.P106.slice(0, 4)) {
                  const id = claim.mainsnak && claim.mainsnak.datavalue && claim.mainsnak.datavalue.value && claim.mainsnak.datavalue.value.id;
                  if (id) { ids.push(id); }
                }
              } else if (value && value.id) { ids.push(value.id); }
            }
            labels = await resolveLabels(ids);
            const links = [];
            const website = claimValue(entity, 'P856');
            if (website) { links.push({ label: 'Official website', url: website }); }
            const x = claimValue(entity, 'P2002');
            if (x) { links.push({ label: 'X / Twitter', url: 'https://x.com/' + x }); }
            const instagram = claimValue(entity, 'P2009');
            if (instagram) { links.push({ label: 'Instagram', url: 'https://instagram.com/' + instagram }); }
            const facebook = claimValue(entity, 'P2013');
            if (facebook) { links.push({ label: 'Facebook', url: 'https://facebook.com/' + facebook }); }
            const youtube = claimValue(entity, 'P2397');
            if (youtube) { links.push({ label: 'YouTube', url: 'https://youtube.com/channel/' + youtube }); }
            const tiktok = claimValue(entity, 'P7085');
            if (tiktok) { links.push({ label: 'TikTok', url: 'https://tiktok.com/@' + tiktok }); }
            const musicbrainz = claimValue(entity, 'P434');
            if (musicbrainz) { links.push({ label: 'MusicBrainz', url: 'https://musicbrainz.org/artist/' + musicbrainz }); }
            if (summary && summary.content_urls && summary.content_urls.desktop) {
              links.unshift({ label: 'Wikipedia', url: summary.content_urls.desktop.page });
            }
            const genreClaims = entity.claims.P136 || [];
            const genres = genreClaims.slice(0, 3).map((claim) => {
              const id = claim.mainsnak && claim.mainsnak.datavalue && claim.mainsnak.datavalue.value && claim.mainsnak.datavalue.value.id;
              return id ? labels[id] : null;
            }).filter(Boolean);
            const facts = [];
            const birthName = claimValue(entity, 'P1477');
            if (birthName && birthName.text) { facts.push(['Birth name', birthName.text]); }
            const birthDate = claimValue(entity, 'P569');
            if (birthDate) { facts.push(['Born', formatDate(birthDate)]); }
            const birthPlace = claimValue(entity, 'P19');
            if (birthPlace && birthPlace.id && labels[birthPlace.id]) { facts.push(['Birthplace', labels[birthPlace.id]]); }
            const country = claimValue(entity, 'P27');
            if (country && country.id && labels[country.id]) { facts.push(['Country', labels[country.id]]); }
            if (genres.length) { facts.push(['Genres', genres.join(', ')]); }
            const occupations = (entity.claims.P106 || []).slice(0, 3).map((claim) => {
              const id = claim.mainsnak && claim.mainsnak.datavalue && claim.mainsnak.datavalue.value && claim.mainsnak.datavalue.value.id;
              return id ? labels[id] : null;
            }).filter(Boolean);
            if (occupations.length) { facts.push(['Profession', occupations.join(', ')]); }
            const label = claimValue(entity, 'P264');
            if (label && label.id && labels[label.id]) { facts.push(['Label', labels[label.id]]); }
            wikidata = { facts, links, qid };
          }
        }
      } catch (error) {
        wikidata = null;
      }

      const artist = {
        name,
        summary: summary && summary.extract ? summary.extract : '',
        image: summary && summary.thumbnail ? summary.thumbnail.source : '',
        facts: wikidata ? wikidata.facts : [],
        links: wikidata ? wikidata.links : [],
        wikiUrl: summary && summary.content_urls && summary.content_urls.desktop ? summary.content_urls.desktop.page : ''
      };
      artistCache.set(name, artist);
      if (state.artistFor !== name) { return; }
      state.artist = artist;
      state.artistStatus = '';
      renderArtist();
    } catch (error) {
      if (state.artistFor !== name) { return; }
      state.artist = { name, summary: '', facts: [], links: [], error: error.message };
      renderArtist();
    }
  }

  function renderArtist() {
    if (!refs.artist) { return; }
    const artist = state.artist;
    refs.artist.textContent = '';
    if (!artist) {
      refs.artist.innerHTML = '<div class="sum-status">Open a track to see verified artist information.</div>';
      return;
    }
    const hero = document.createElement('div');
    hero.className = 'sum-artist-hero';
    if (artist.image) {
      const image = document.createElement('img');
      image.className = 'sum-artist-image';
      image.src = artist.image;
      image.alt = artist.name;
      image.loading = 'lazy';
      hero.appendChild(image);
    }
    const heading = document.createElement('div');
    heading.className = 'sum-artist-name';
    heading.textContent = artist.name;
    hero.appendChild(heading);
    refs.artist.appendChild(hero);

    if (artist.summary) {
      const paragraph = document.createElement('p');
      paragraph.className = 'sum-summary';
      paragraph.textContent = artist.summary;
      refs.artist.appendChild(paragraph);
    } else {
      const paragraph = document.createElement('p');
      paragraph.className = 'sum-status';
      paragraph.textContent = 'No verified biography was found for this artist.';
      refs.artist.appendChild(paragraph);
    }

    if (artist.facts && artist.facts.length) {
      const list = document.createElement('div');
      list.className = 'sum-facts';
      for (const [label, value] of artist.facts) {
        if (!value) { continue; }
        const row = document.createElement('div');
        row.className = 'sum-fact';
        const key = document.createElement('span');
        key.className = 'sum-fact-key';
        key.textContent = label;
        const val = document.createElement('span');
        val.className = 'sum-fact-value';
        val.textContent = value;
        row.appendChild(key);
        row.appendChild(val);
        list.appendChild(row);
      }
      refs.artist.appendChild(list);
    }

    if (artist.links && artist.links.length) {
      const links = document.createElement('div');
      links.className = 'sum-links';
      for (const link of artist.links) {
        const anchor = document.createElement('a');
        anchor.className = 'sum-link';
        anchor.href = link.url;
        anchor.target = '_blank';
        anchor.rel = 'noreferrer noopener';
        anchor.textContent = link.label;
        links.appendChild(anchor);
      }
      refs.artist.appendChild(links);
    }

    const note = document.createElement('div');
    note.className = 'sum-note';
    note.textContent = 'Sources: Wikipedia, Wikidata and Spotify. Only documented facts are shown.';
    refs.artist.appendChild(note);
  }

  function loop() {
    syncTrack();
    ensurePlayerButton();
    decorateAllMenus();
    if (state.open && state.tab === 'lyrics' && state.lines.length) {
      updateActive(false);
    }
  }

  if (window.__SUM_KEY_HANDLER__) { document.removeEventListener('keydown', window.__SUM_KEY_HANDLER__); }
  window.__SUM_KEY_HANDLER__ = (event) => {
    if (event.ctrlKey && event.shiftKey && (event.key === 'U' || event.key === 'u')) {
      event.preventDefault();
      setOpen(!state.open);
    }
  };
  document.addEventListener('keydown', window.__SUM_KEY_HANDLER__);

  mount();
  syncTrack();
  const timer = setInterval(loop, 700);
  window.__SUM_TIMER__ = timer;
  window.__SUM_REFRESH__ = () => {
    installSheet('base', CSS);
    installSheet('custom', sanitizeCss(readSetting(LS.css, '')));
    applyTheme();
    applyCustomHtml(readSetting(LS.html, ''));
    syncTrack();
  };
  window.__SUM__ = {
    version: VERSION,
    state,
    translate: window.__SUM_TRANSLATE__,
    render: renderLyrics,
    refresh: window.__SUM_REFRESH__
  };

  return 'ok';
})();
