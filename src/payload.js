(() => {
  'use strict';

  const VERSION = '3.10.0';
  const UPDATE_COMMAND = 'irm https://raw.githubusercontent.com/nykl3ar-max/spotifine/main/install.ps1 | iex';
  const LATEST_VERSION_URL = 'https://raw.githubusercontent.com/nykl3ar-max/spotifine/main/version.txt';
  const FACT_ORDER = ['Birth name', 'Born', 'Birthplace', 'Origin', 'Country', 'Active', 'Genres', 'Profession', 'Instruments', 'Members', 'Label'];
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
    effect: 'sum.surface',
    open: 'sum.open',
    tab: 'sum.tab',
    scroll: 'sum.autoscroll',
    romanize: 'sum.romanize',
    languages: 'sum.languages.v1',
    trans: 'sum.translations.v2',
    width: 'sum.width',
    side: 'sum.side',
    glassAlpha: 'sum.glassAlpha',
    glassBlur: 'sum.glassBlur'
  };

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

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
      id: 'amoled', name: 'AMOLED', accent: '#00e5a0', effect: 'oled',
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
      id: 'nord', name: 'Nord', accent: '#88c0d0',
      vars: { '--background-base': '#22272f', '--background-elevated-base': '#2e3440', '--background-elevated-highlight': '#3b4252', '--background-tinted-base': '#282e38', '--background-tinted-highlight': '#353c49', '--text-base': '#eceff4', '--text-subdued': '#aeb8c8', '--essential-base': '#88c0d0', '--essential-bright-accent': '#8fbcbb' }
    },
    {
      id: 'sunset', name: 'Sunset', accent: '#ff7a59',
      vars: { '--background-base': '#1a0f14', '--background-elevated-base': '#2a1820', '--background-elevated-highlight': '#37202a', '--background-tinted-base': '#211319', '--background-tinted-highlight': '#301c25', '--text-base': '#fff1ea', '--text-subdued': '#c9a79c', '--essential-base': '#ff7a59', '--essential-bright-accent': '#ffa07a' }
    },
    {
      id: 'mono', name: 'Mono', accent: '#f5f5f5',
      vars: { '--background-base': '#0f0f0f', '--background-elevated-base': '#1c1c1c', '--background-elevated-highlight': '#272727', '--background-tinted-base': '#151515', '--background-tinted-highlight': '#222222', '--text-base': '#f5f5f5', '--text-subdued': '#9a9a9a', '--essential-base': '#f5f5f5', '--essential-bright-accent': '#ffffff' }
    },
    {
      id: 'rose', name: 'Rose', accent: '#f472b6',
      vars: { '--background-base': '#160b12', '--background-elevated-base': '#24121d', '--background-elevated-highlight': '#311a27', '--background-tinted-base': '#1c0f17', '--background-tinted-highlight': '#2a1621', '--text-base': '#ffeef6', '--text-subdued': '#c9a3b6', '--essential-base': '#f472b6', '--essential-bright-accent': '#f9a8d4' }
    },
    {
      id: 'oled', name: 'OLED', accent: '#1ed760', effect: 'oled',
      vars: { '--background-base': '#000000', '--background-elevated-base': '#000000', '--background-elevated-highlight': '#0a0a0a', '--background-tinted-base': '#000000', '--background-tinted-highlight': '#050505', '--text-base': '#ffffff', '--text-subdued': '#a7a7a7', '--essential-base': '#1ed760', '--essential-bright-accent': '#1ed760' }
    },
    {
      id: 'glass', name: 'Glass', accent: '#7dd3fc', effect: 'glass',
      vars: { '--background-base': '#0b0b14', '--background-elevated-base': '#161622', '--background-elevated-highlight': '#202033', '--background-tinted-base': '#10101c', '--background-tinted-highlight': '#1b1b2b', '--text-base': '#f2f5ff', '--text-subdued': '#aab1c9', '--essential-base': '#7dd3fc', '--essential-bright-accent': '#7dd3fc' }
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
    effect: readSetting(LS.effect, ''),
    custom: readSetting(LS.custom, { base: '#121212', elevated: '#1f1f1f', text: '#ffffff', accent: '#1ed760' }),
    width: clamp(Number(readSetting(LS.width, 372)) || 372, 360, 620),
    side: readSetting(LS.side, 'right') === 'left' ? 'left' : 'right',
    glassAlpha: clamp(Number(readSetting(LS.glassAlpha, 55)) || 55, 20, 90),
    glassBlur: clamp(Number(readSetting(LS.glassBlur, 26)) || 0, 0, 40),
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
    artistRequest: 0,
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
    <aside id="sum-panel" aria-label="Spotifine panel">
      <div id="sum-resize" class="sum-resize" title="Drag to resize" aria-hidden="true"></div>
      <header class="sum-header">
        <div class="sum-tabs">
          <button type="button" class="sum-tab" data-sum-tab="lyrics">Lyrics</button>
          <button type="button" class="sum-tab" data-sum-tab="artist">Artist</button>
          <button type="button" class="sum-tab" data-sum-tab="style">Style</button>
        </div>
        <button type="button" id="sum-update" class="sum-update" hidden>Update</button>
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
          <div class="sum-label">Surface</div>
          <div class="sum-surfaces" id="sum-surfaces">
            <button type="button" class="sum-surface" data-sum-effect="solid">Solid</button>
            <button type="button" class="sum-surface" data-sum-effect="glass">Glass</button>
            <button type="button" class="sum-surface" data-sum-effect="oled">OLED</button>
          </div>
          <div class="sum-label">Panel</div>
          <div class="sum-row">
            <span class="sum-label">Width</span>
            <span class="sum-range-field"><input id="sum-width" type="range" min="360" max="620" step="4" class="sum-range" aria-label="Panel width"><code id="sum-width-value" class="sum-hex">372px</code></span>
          </div>
          <div class="sum-row">
            <span class="sum-label">Position</span>
            <span class="sum-segment" id="sum-side">
              <button type="button" class="sum-segment-btn" data-sum-side="right">Right</button>
              <button type="button" class="sum-segment-btn" data-sum-side="left">Left</button>
            </span>
          </div>
          <div class="sum-label">Glass</div>
          <div class="sum-row">
            <span class="sum-label">Opacity</span>
            <span class="sum-range-field"><input id="sum-glass-alpha" type="range" min="20" max="90" step="1" class="sum-range" aria-label="Glass opacity"><code id="sum-glass-alpha-value" class="sum-hex">55%</code></span>
          </div>
          <div class="sum-row">
            <span class="sum-label">Blur</span>
            <span class="sum-range-field"><input id="sum-glass-blur" type="range" min="0" max="40" step="1" class="sum-range" aria-label="Glass blur"><code id="sum-glass-blur-value" class="sum-hex">26px</code></span>
          </div>
          <div class="sum-row sum-actions">
            <button type="button" id="sum-layout-reset" class="sum-btn sum-ghost">Reset layout</button>
          </div>
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
          <div class="sum-label">About</div>
          <div class="sum-note" id="sum-version">Spotifine</div>
          <div class="sum-row sum-actions">
            <button type="button" id="sum-update-copy" class="sum-btn" hidden>Copy update command</button>
            <a class="sum-link" href="https://github.com/nykl3ar-max/spotifine" target="_blank" rel="noreferrer noopener">GitHub</a>
          </div>
          <div class="sum-note">Translation and pronunciation modelled on <a class="sum-link" href="https://github.com/TheoreticallyBryChen/Lingo-lyrics" target="_blank" rel="noreferrer noopener">Lingo-lyrics</a> (independent implementation).</div>
        </section>
      </div>
      <footer class="sum-footer"><span id="sum-track-label">Spotifine</span></footer>
    </aside>`;

  let refs = {};

  function mount() {
    const old = document.getElementById('sum-root');
    if (old) { old.remove(); }
    document.querySelectorAll('[data-sum-toggle="true"]').forEach((node) => node.remove());
    if (window.__SUM_TIMER__) { clearInterval(window.__SUM_TIMER__); }
    if (window.__SUM_UPDATE_TIMER__) { clearInterval(window.__SUM_UPDATE_TIMER__); }
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
      update: root.querySelector('#sum-update'),
      versionNote: root.querySelector('#sum-version'),
      updateCopy: root.querySelector('#sum-update-copy'),
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
      surfaces: root.querySelector('#sum-surfaces'),
      resize: root.querySelector('#sum-resize'),
      width: root.querySelector('#sum-width'),
      widthValue: root.querySelector('#sum-width-value'),
      side: root.querySelector('#sum-side'),
      glassAlpha: root.querySelector('#sum-glass-alpha'),
      glassAlphaValue: root.querySelector('#sum-glass-alpha-value'),
      glassBlur: root.querySelector('#sum-glass-blur'),
      glassBlurValue: root.querySelector('#sum-glass-blur-value'),
      layoutReset: root.querySelector('#sum-layout-reset'),
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
      trackLabel: root.querySelector('#sum-track-label'),
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
      button.innerHTML = `<span class="sum-theme-dot" style="background:linear-gradient(135deg, ${theme.vars['--background-base']} 50%, ${theme.accent} 50%)"></span><span>${theme.name}</span>`;
      button.addEventListener('click', () => {
        state.theme = theme.id;
        state.accent = '';
        state.effect = theme.effect || 'solid';
        writeSetting(LS.theme, theme.id);
        writeSetting(LS.accent, '');
        writeSetting(LS.effect, state.effect);
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
    if (refs.surfaces) {
      refs.surfaces.querySelectorAll('[data-sum-effect]').forEach((button) => {
        button.addEventListener('click', () => {
          state.effect = button.dataset.sumEffect;
          writeSetting(LS.effect, state.effect);
          applyTheme();
        });
      });
    }
    if (refs.width) {
      refs.width.addEventListener('input', () => {
        state.width = clamp(Number(refs.width.value) || 372, 360, 620);
        writeSetting(LS.width, state.width);
        applyLayout();
      });
    }
    if (refs.glassAlpha) {
      refs.glassAlpha.addEventListener('input', () => {
        state.glassAlpha = clamp(Number(refs.glassAlpha.value) || 55, 20, 90);
        writeSetting(LS.glassAlpha, state.glassAlpha);
        applyLayout();
      });
    }
    if (refs.glassBlur) {
      refs.glassBlur.addEventListener('input', () => {
        state.glassBlur = clamp(Number(refs.glassBlur.value) || 0, 0, 40);
        writeSetting(LS.glassBlur, state.glassBlur);
        applyLayout();
      });
    }
    if (refs.side) {
      refs.side.querySelectorAll('[data-sum-side]').forEach((button) => {
        button.addEventListener('click', () => {
          state.side = button.dataset.sumSide === 'left' ? 'left' : 'right';
          writeSetting(LS.side, state.side);
          applyLayout();
        });
      });
    }
    if (refs.layoutReset) {
      refs.layoutReset.addEventListener('click', () => {
        state.width = 372;
        state.side = 'right';
        state.glassAlpha = 55;
        state.glassBlur = 26;
        writeSetting(LS.width, state.width);
        writeSetting(LS.side, state.side);
        writeSetting(LS.glassAlpha, state.glassAlpha);
        writeSetting(LS.glassBlur, state.glassBlur);
        applyLayout();
      });
    }
    bindResize();
    refs.themeReset.addEventListener('click', () => {
      const theme = THEMES[0];
      state.theme = theme.id;
      state.accent = '';
      state.effect = 'solid';
      state.custom = {
        base: theme.vars['--background-base'],
        elevated: theme.vars['--background-elevated-base'],
        text: theme.vars['--text-base'],
        accent: theme.accent
      };
      writeSetting(LS.theme, state.theme);
      writeSetting(LS.accent, '');
      writeSetting(LS.effect, state.effect);
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
    if (refs.update) { refs.update.addEventListener('click', copyUpdate); }
    if (refs.updateCopy) { refs.updateCopy.addEventListener('click', copyUpdate); }

    renderUpdate();
    setTimeout(checkForUpdate, 1200);
    window.__SUM_UPDATE_TIMER__ = setInterval(checkForUpdate, 21600000);

    applyTheme();
    applyLayout();
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
      button.setAttribute('aria-label', 'Spotifine');
      button.setAttribute('title', 'Spotifine (Ctrl+Shift+U)');
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
    fallback.setAttribute('aria-label', 'Spotifine');
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
      button.setAttribute('aria-label', 'Spotifine settings');
      const label = button.querySelector('[data-encore-id="text"]');
      if (label) {
        label.textContent = 'Spotifine settings';
        const labelWrap = label.parentElement;
        [...button.children].forEach((child) => { if (child !== labelWrap) { child.remove(); } });
      } else {
        button.textContent = 'Spotifine settings';
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

  function applyLayout() {
    const root = document.documentElement;
    const width = clamp(Number(state.width) || 372, 360, 620);
    const alpha = clamp(Number(state.glassAlpha) || 55, 20, 90);
    const blur = clamp(Number(state.glassBlur) || 0, 0, 40);
    state.width = width;
    state.glassAlpha = alpha;
    state.glassBlur = blur;
    root.style.setProperty('--sum-width', width + 'px');
    root.style.setProperty('--sum-glass-alpha', alpha + '%');
    root.style.setProperty('--sum-glass-blur', blur + 'px');
    root.style.setProperty('--sum-glass-menu', Math.min(92, alpha + 17) + '%');
    root.style.setProperty('--sum-glass-card', Math.max(14, alpha - 10) + '%');
    if (refs.panel) { refs.panel.classList.toggle('is-left', state.side === 'left'); }
    if (refs.width) { refs.width.value = String(width); }
    if (refs.widthValue) { refs.widthValue.textContent = width + 'px'; }
    if (refs.glassAlpha) { refs.glassAlpha.value = String(alpha); }
    if (refs.glassAlphaValue) { refs.glassAlphaValue.textContent = alpha + '%'; }
    if (refs.glassBlur) { refs.glassBlur.value = String(blur); }
    if (refs.glassBlurValue) { refs.glassBlurValue.textContent = blur + 'px'; }
    if (refs.side) {
      refs.side.querySelectorAll('[data-sum-side]').forEach((button) => {
        button.classList.toggle('is-active', button.dataset.sumSide === state.side);
      });
    }
  }

  function bindResize() {
    if (!refs.resize || !refs.panel) { return; }
    let drag = null;
    const finish = () => {
      if (!drag) { return; }
      drag = null;
      writeSetting(LS.width, state.width);
    };
    refs.resize.addEventListener('pointerdown', (event) => {
      drag = { x: event.clientX, width: refs.panel.getBoundingClientRect().width, side: state.side };
      try { refs.resize.setPointerCapture(event.pointerId); } catch (error) { }
      event.preventDefault();
    });
    refs.resize.addEventListener('pointermove', (event) => {
      if (!drag) { return; }
      const delta = drag.side === 'left' ? event.clientX - drag.x : drag.x - event.clientX;
      state.width = clamp(Math.round(drag.width + delta), 360, 620);
      applyLayout();
    });
    refs.resize.addEventListener('pointerup', finish);
    refs.resize.addEventListener('pointercancel', finish);
  }

  function applyTheme() {
    const theme = themeById(state.theme);
    const vars = theme.id === 'custom' ? customVars(state.custom) : theme.vars;
    const accent = state.accent || theme.accent;
    const effect = state.effect || theme.effect || 'solid';
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
    root.setAttribute('data-sum-effect', effect);
    syncThemeFields(vars, accent);
    if (refs.surfaces) {
      refs.surfaces.querySelectorAll('[data-sum-effect]').forEach((button) => {
        button.classList.toggle('is-active', button.dataset.sumEffect === effect);
      });
    }
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
      .map((link) => ({ name: link.textContent.trim(), url: link.href }))
      .filter((entry) => entry.name && entry.name !== title);
    const artists = [...new Set(artistLinks.map((entry) => entry.name))];
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
      artistUrl: (artistLinks.find((entry) => entry.name === artists[0]) || {}).url || '',
      cover: coverImg ? coverImg.src : '',
      position: parseClock(positionEl ? positionEl.textContent : ''),
      duration: parseClock(durationEl ? durationEl.textContent : ''),
      playing: playBtn ? (playBtn.getAttribute('aria-label') || '').toLowerCase().includes('pause') : false
    };
  }

  function updateTrackLabel() {
    if (!refs.trackLabel) { return; }
    const track = state.track;
    refs.trackLabel.textContent = track ? track.title + ' — ' + track.artist : 'Spotifine';
    refs.trackLabel.title = track ? 'Sources: LRCLIB, Wikipedia and Wikidata' : '';
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

  async function fetchJson(url, attempts) {
    const total = attempts || 2;
    let lastError = null;
    for (let attempt = 0; attempt < total; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 12000);
      try {
        const response = await fetch(url, { headers: { Accept: 'application/json' }, signal: controller.signal });
        if (!response.ok) { throw new Error('HTTP ' + response.status); }
        return await response.json();
      } catch (error) {
        lastError = error;
        if (/^HTTP 4/.test(String(error && error.message || ''))) { break; }
        if (attempt + 1 < total) { await new Promise((resolve) => setTimeout(resolve, 350)); }
      } finally {
        clearTimeout(timer);
      }
    }
    throw lastError || new Error('Request failed');
  }

  function trimCache(cache, limit) {
    while (cache.size > limit) {
      const oldest = cache.keys().next().value;
      if (oldest === undefined) { break; }
      cache.delete(oldest);
    }
  }

  const IMAGE_BLOCKLIST = /(logo|icon|signature|wordmark|symbol|seal|coat[ _]of[ _]arms|flag|map|chart|award|cover|album|single|poster|screenshot|commons|wikimedia|wikipedia|edit|question|ambox|padlock|barnstar|stub|placeholder|avatar|default)/i;

  function usableImageTitle(title) {
    const value = String(title || '');
    return /\.(jpe?g|png|webp)$/i.test(value) && !IMAGE_BLOCKLIST.test(value);
  }

  function imageName(url) {
    try {
      const path = decodeURIComponent(String(url || '').split('?')[0]);
      return path.split('/').pop().toLowerCase().replace(/^\d+px-/, '');
    } catch (error) { return String(url || ''); }
  }

  function commonsMatches(filename, artist) {
    const tokens = normalizeName(artist).split(' ').filter((token) => token.length > 2);
    if (!tokens.length) { return true; }
    const name = normalizeName(String(filename || '').replace(/\.[a-z0-9]+$/i, ''));
    const hits = tokens.filter((token) => name.indexOf(token) >= 0).length;
    return hits >= Math.max(1, Math.ceil(tokens.length / 2));
  }

  async function fetchArtistImages(title, name) {
    const images = [];
    const seen = new Set();
    const add = (url) => {
      if (!url) { return; }
      const key = imageName(url);
      if (!key || seen.has(key)) { return; }
      seen.add(key);
      images.push(url);
    };
    if (title) {
      try {
        const data = await fetchJson('https://en.wikipedia.org/w/api.php?action=query&titles=' + encodeURIComponent(title) +
          '&prop=images&imlimit=60&format=json&origin=*');
        const page = Object.values((data.query && data.query.pages) || {})[0];
        const files = ((page && page.images) || []).map((item) => item.title).filter(usableImageTitle).slice(0, 12);
        if (files.length) {
          const info = await fetchJson('https://en.wikipedia.org/w/api.php?action=query&titles=' + encodeURIComponent(files.join('|')) +
            '&prop=imageinfo&iiprop=url&iiurlwidth=520&format=json&origin=*');
          Object.values((info.query && info.query.pages) || {}).forEach((entry) => {
            const item = entry.imageinfo && entry.imageinfo[0];
            if (item) { add(item.thumburl || item.url); }
          });
        }
      } catch (error) { }
    }
    try {
      const search = await fetchJson('https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=' +
        encodeURIComponent(name) + '&gsrnamespace=6&gsrlimit=24&prop=imageinfo&iiprop=url&iiurlwidth=520&format=json&origin=*');
      Object.values((search.query && search.query.pages) || {})
        .filter((entry) => usableImageTitle(entry.title) && commonsMatches(entry.title, name))
        .forEach((entry) => {
          const item = entry.imageinfo && entry.imageinfo[0];
          if (item) { add(item.thumburl || item.url); }
        });
    } catch (error) { }
    return images.slice(0, 10);
  }

  const LINK_ICONS = {
    wikipedia: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.4 3h4.2c.8 0 1.4.6 1.4 1.4v8.2c-.4-.4-.9-.6-1.4-.6H2.4zM13.6 3H9.4c-.8 0-1.4.6-1.4 1.4v8.2c.4-.4.9-.6 1.4-.6h4.2z"/></svg>',
    website: '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="5.7" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M2.4 8h11.2M8 2.3c2 1.8 2 9.6 0 11.4M8 2.3c-2 1.8-2 9.6 0 11.4" fill="none" stroke="currentColor" stroke-width="1.1"/></svg>',
    x: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.2 2h3l3 4 3-4h2.6L9.1 7.9 13.8 14h-3l-3.1-4.2L4.4 14H1.8l4.6-6z"/></svg>',
    instagram: '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="2.1" y="2.1" width="11.8" height="11.8" rx="3.5" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="8" cy="8" r="2.8" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="11.6" cy="4.4" r="0.9"/></svg>',
    facebook: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M9.1 14V8.8h1.8l.3-2H9.1V5.4c0-.6.2-1 1-1h1V2.5c-.2 0-.8-.1-1.6-.1-1.6 0-2.7 1-2.7 2.8v1.6H5v2h1.8V14z"/></svg>',
    youtube: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M14.3 5.3c-.1-.6-.6-1.1-1.2-1.2C12 3.8 8 3.8 8 3.8s-4 0-5.1.3c-.6.1-1.1.6-1.2 1.2C1.5 6.3 1.5 8 1.5 8s0 1.7.2 2.7c.1.6.6 1.1 1.2 1.2 1.1.3 5.1.3 5.1.3s4 0 5.1-.3c.6-.1 1.1-.6 1.2-1.2.2-1 .2-2.7.2-2.7s0-1.7-.2-2.7zM6.6 10.2V5.8L10.4 8z"/></svg>',
    tiktok: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M9.9 2h1.8c.1.9.6 1.7 1.4 2.2.4.2.8.3 1.2.3v1.9c-.9 0-1.8-.3-2.5-.8v4.2a3.5 3.5 0 1 1-3.5-3.5c.2 0 .4 0 .6.1v2a1.6 1.6 0 1 0 1 1.4z"/></svg>',
    musicbrainz: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6.2 11.3V4.4l5.8-1.1v6.6" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="4.6" cy="11.8" r="1.7"/><circle cx="10.4" cy="10.4" r="1.7"/></svg>',
    spotify: '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M4.7 6.2c2.2-.6 4.6-.3 6.6.8M5 8.2c1.8-.5 3.8-.2 5.4.7M5.4 10.1c1.4-.4 2.9-.2 4.1.5" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>',
    wikidata: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.8l6.2 6.2L8 14.2 1.8 8z" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>'
  };

  function iconForLink(label) {
    const value = String(label || '').toLowerCase();
    if (value.indexOf('spotify') >= 0) { return LINK_ICONS.spotify; }
    if (value.indexOf('wikidata') >= 0) { return LINK_ICONS.wikidata; }
    if (value.indexOf('instagram') >= 0) { return LINK_ICONS.instagram; }
    if (value.indexOf('twitter') >= 0 || value.indexOf('x /') >= 0) { return LINK_ICONS.x; }
    if (value.indexOf('facebook') >= 0) { return LINK_ICONS.facebook; }
    if (value.indexOf('youtube') >= 0) { return LINK_ICONS.youtube; }
    if (value.indexOf('tiktok') >= 0) { return LINK_ICONS.tiktok; }
    if (value.indexOf('wikipedia') >= 0) { return LINK_ICONS.wikipedia; }
    if (value.indexOf('musicbrainz') >= 0) { return LINK_ICONS.musicbrainz; }
    return LINK_ICONS.website;
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
        lyricCache.set(track.key, { lines: [], status: state.lyricsStatus }); trimCache(lyricCache, 40);
        renderLyrics();
        return;
      }
      if (record.instrumental) {
        state.lines = [];
        state.lyricsStatus = 'Instrumental track — no lyrics to display.';
        lyricCache.set(track.key, { lines: [], status: state.lyricsStatus }); trimCache(lyricCache, 40);
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
      lyricCache.set(track.key, { lines: state.lines, status: state.lyricsStatus }); trimCache(lyricCache, 40);
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

  const MUSIC_OCCUPATIONS = new Set([
    'Q177220', 'Q2252262', 'Q639669', 'Q48820564', 'Q753110', 'Q36834', 'Q183945',
    'Q1622272', 'Q855091', 'Q486748', 'Q386854', 'Q584301', 'Q158852', 'Q12800682'
  ]);

  const MUSIC_GROUPS = new Set([
    'Q215380', 'Q2088357', 'Q10648343', 'Q641066', 'Q216337', 'Q5741069', 'Q1143604', 'Q42998'
  ]);

  const MUSIC_DESCRIPTION = /\b(singer|rapper|musician|band|duo|trio|songwriter|composer|producer|disc jockey|dj|hip[- ]hop|pop|rock|metal|jazz|soul|orchestra|choir|soundtrack|recording artist|vocalist)\b/i;

  function entityValues(entity, property) {
    const claims = entity && entity.claims && entity.claims[property];
    if (!claims) { return []; }
    return claims
      .map((claim) => claim.mainsnak && claim.mainsnak.datavalue && claim.mainsnak.datavalue.value && claim.mainsnak.datavalue.value.id)
      .filter(Boolean);
  }

  function entityDescription(entity) {
    return entity && entity.descriptions && entity.descriptions.en ? entity.descriptions.en.value : '';
  }

  function isMusicEntity(entity) {
    if (!entity) { return false; }
    const occupations = entityValues(entity, 'P106');
    const instances = entityValues(entity, 'P31');
    if (occupations.some((id) => MUSIC_OCCUPATIONS.has(id))) { return true; }
    if (instances.some((id) => MUSIC_GROUPS.has(id)) || occupations.some((id) => MUSIC_GROUPS.has(id))) { return true; }
    const description = entityDescription(entity);
    if (MUSIC_DESCRIPTION.test(description) && !/samurai|code of|philosophy|concept/i.test(description)) { return true; }
    return false;
  }

  async function findMusicEntity(name) {
    const cleaned = String(name || '')
      .replace(/\s*[([].*?[)\]]\s*/g, ' ')
      .replace(/\s*-\s*topic\s*$/i, '')
      .replace(/\s*vevo\s*$/i, '')
      .trim();
    const target = normalizeName(cleaned || name);
    const searchName = cleaned || name;
    try {
      const search = await fetchJson('https://www.wikidata.org/w/api.php?action=wbsearchentities&search=' +
        encodeURIComponent(searchName) + '&language=en&type=item&limit=10&format=json&origin=*');
      const ids = ((search.search || []).map((item) => item.id).filter(Boolean)).slice(0, 10);
      if (!ids.length) { return null; }
      const data = await fetchJson('https://www.wikidata.org/w/api.php?action=wbgetentities&ids=' + ids.join('|') +
        '&props=claims|descriptions|labels|sitelinks&languages=en&sitefilter=enwiki&format=json&origin=*');
      let best = null;
      for (const id of ids) {
        const entity = data.entities && data.entities[id];
        if (!entity) { continue; }
        const label = entity.labels && entity.labels.en ? entity.labels.en.value : '';
        const normalized = normalizeName(label);
        if (normalized !== target && normalized.indexOf(target) < 0) { continue; }
        if (!isMusicEntity(entity)) { continue; }
        const title = entity.sitelinks && entity.sitelinks.enwiki ? entity.sitelinks.enwiki.title : '';
        if (!title) { continue; }
        const description = entityDescription(entity);
        let score = 0;
        if (normalized === target) { score += 5; }
        if (entityValues(entity, 'P106').some((value) => MUSIC_OCCUPATIONS.has(value))) { score += 4; }
        if (entityValues(entity, 'P31').some((value) => MUSIC_GROUPS.has(value))) { score += 3; }
        if (MUSIC_DESCRIPTION.test(description)) { score += 2; }
        if (/samurai|code of|philosophy|concept/i.test(description)) { score -= 10; }
        if (!best || score > best.score) { best = { score, title, qid: id, entity }; }
      }
      return best;
    } catch (error) {
      return null;
    }
  }

  async function findWikipedia(name) {
    const music = await findMusicEntity(name);
    if (music) {
      try {
        const summary = await fetchJson('https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(music.title));
        if (summary && summary.type !== 'disambiguation' && summary.extract) {
          return { title: music.title, summary, qid: music.qid, entity: music.entity };
        }
      } catch (error) { }
    }
    const target = normalizeName(name);
    const queries = [name + ' rapper', name + ' singer', name + ' musician', name + ' band'];
    for (const query of queries) {
      try {
        const result = await fetchJson('https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=' +
          encodeURIComponent(query) + '&srlimit=8&format=json&origin=*');
        const hits = (result.query && result.query.search) || [];
        for (const hit of hits) {
          if (normalizeName(hit.title).indexOf(target) < 0) { continue; }
          try {
            const summary = await fetchJson('https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(hit.title));
            const description = summary && summary.description ? summary.description : '';
            if (!summary || summary.type === 'disambiguation' || !summary.extract) { continue; }
            if (!MUSIC_DESCRIPTION.test(description) || /samurai|code of|philosophy/i.test(description)) { continue; }
            return { title: hit.title, summary };
          } catch (error) { }
        }
      } catch (error) { }
    }
    return null;
  }

  async function loadArtistForCurrent() {
    const track = state.track;
    if (!track) { return; }
    return loadArtistFor(track.artists[0] || track.artist, track.artistUrl || '');
  }

  async function loadArtistFor(name, artistUrl) {
    if (!name) { return; }
    if (state.artistFor === name && state.artist) { return; }
    state.artistFor = name;
    const requestId = ++state.artistRequest;
    const memory = artistCache.get(name);
    if (memory) { state.artist = memory; renderArtist(); return; }
    if (refs.artist) { refs.artist.innerHTML = '<div class="sum-status">Loading artist information…</div>'; }
    try {
      const wiki = await findWikipedia(name);
      const summary = wiki ? wiki.summary : null;
      let wikidata = null;
      let labels = {};
      try {
        let qid = wiki && wiki.qid ? wiki.qid : '';
        let entity = wiki && wiki.entity ? wiki.entity : null;
        if (!entity) {
          const search = await fetchJson('https://www.wikidata.org/w/api.php?action=wbsearchentities&search=' +
            encodeURIComponent(name) + '&language=en&type=item&limit=6&format=json&origin=*');
          const searchIds = ((search.search || []).map((item) => item.id).filter(Boolean)).slice(0, 6);
          if (searchIds.length) {
            const entityData = await fetchJson('https://www.wikidata.org/w/api.php?action=wbgetentities&ids=' + searchIds.join('|') +
              '&props=claims|descriptions&languages=en&format=json&origin=*');
            for (const candidateId of searchIds) {
              const candidate = entityData.entities && entityData.entities[candidateId];
              if (candidate && isMusicEntity(candidate)) {
                entity = candidate;
                qid = candidateId;
                break;
              }
            }
          }
        }
        if (entity) {
            const ids = [];
            for (const property of ['P19', 'P27', 'P106', 'P136', 'P264', 'P740', 'P527', 'P1303']) {
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
            if (artistUrl) { links.push({ label: 'Spotify', url: artistUrl }); }
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
            if (qid) { links.push({ label: 'Wikidata', url: 'https://www.wikidata.org/wiki/' + qid }); }
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
            const origin = claimValue(entity, 'P740');
            if (origin && origin.id && labels[origin.id]) { facts.push(['Origin', labels[origin.id]]); }
            const active = claimValue(entity, 'P2031');
            if (active) { facts.push(['Active', formatDate(active)]); }
            if (genres.length) { facts.push(['Genres', genres.join(', ')]); }
            const occupations = (entity.claims.P106 || []).slice(0, 3).map((claim) => {
              const id = claim.mainsnak && claim.mainsnak.datavalue && claim.mainsnak.datavalue.value && claim.mainsnak.datavalue.value.id;
              return id ? labels[id] : null;
            }).filter(Boolean);
            if (occupations.length) { facts.push(['Profession', occupations.join(', ')]); }
            const instrumentIds = (entity.claims.P1303 || []).slice(0, 3)
              .map((claim) => claim.mainsnak && claim.mainsnak.datavalue && claim.mainsnak.datavalue.value && claim.mainsnak.datavalue.value.id)
              .filter(Boolean);
            const instruments = instrumentIds.map((id) => labels[id]).filter(Boolean);
            if (instruments.length) { facts.push(['Instruments', instruments.join(', ')]); }
            const memberIds = (entity.claims.P527 || []).slice(0, 6)
              .map((claim) => claim.mainsnak && claim.mainsnak.datavalue && claim.mainsnak.datavalue.value && claim.mainsnak.datavalue.value.id)
              .filter(Boolean);
            const members = memberIds.map((id) => labels[id]).filter(Boolean);
            if (members.length) { facts.push(['Members', members.join(', ')]); }
            const label = claimValue(entity, 'P264');
            if (label && label.id && labels[label.id]) { facts.push(['Label', labels[label.id]]); }
            wikidata = { facts, links, qid };
        }
      } catch (error) {
        wikidata = null;
      }

      const commons = await fetchArtistImages(wiki ? wiki.title : '', name);
      const images = [];
      if (summary && summary.thumbnail && summary.thumbnail.source) { images.push(summary.thumbnail.source); }
      commons.forEach((url) => {
        if (!images.some((existing) => imageName(existing) === imageName(url))) { images.push(url); }
      });

      const artist = {
        name,
        summary: summary && summary.extract ? summary.extract : '',
        image: images[0] || '',
        images,
        spotifyUrl: artistUrl || '',
        facts: wikidata ? wikidata.facts : [],
        links: wikidata ? wikidata.links : [],
        wikiUrl: summary && summary.content_urls && summary.content_urls.desktop ? summary.content_urls.desktop.page : ''
      };
      artistCache.set(name, artist);
      trimCache(artistCache, 30);
      if (state.artistFor !== name || requestId !== state.artistRequest) { return; }
      state.artist = artist;
      state.artistStatus = '';
      renderArtist();
    } catch (error) {
      if (state.artistFor !== name || requestId !== state.artistRequest) { return; }
      state.artist = { name, summary: '', facts: [], links: [], error: error.message };
      renderArtist();
    }
  }

  function compareVersions(left, right) {
    const a = String(left).split('.').map((part) => parseInt(part, 10) || 0);
    const b = String(right).split('.').map((part) => parseInt(part, 10) || 0);
    for (let index = 0; index < 3; index++) {
      const difference = (a[index] || 0) - (b[index] || 0);
      if (difference !== 0) { return difference > 0 ? 1 : -1; }
    }
    return 0;
  }

  async function checkForUpdate() {
    try {
      const response = await fetch(LATEST_VERSION_URL + '?t=' + Date.now(), { cache: 'no-store' });
      if (!response.ok) { return; }
      const latest = (await response.text()).trim();
      if (!/^\d+\.\d+\.\d+$/.test(latest)) { return; }
      state.update = { latest, available: compareVersions(latest, VERSION) > 0 };
      renderUpdate();
    } catch (error) { }
  }

  function renderUpdate() {
    const latest = state.update && state.update.available ? state.update.latest : '';
    if (refs.update) {
      refs.update.hidden = !latest;
      refs.update.textContent = latest ? 'v' + latest : 'Update';
      refs.update.title = latest ? 'Version ' + latest + ' is available — click to copy the update command' : '';
    }
    if (refs.versionNote) {
      refs.versionNote.textContent = latest
        ? 'Spotifine v' + VERSION + ' · update v' + latest + ' available'
        : 'Spotifine v' + VERSION + ' · up to date';
    }
    if (refs.updateCopy) { refs.updateCopy.hidden = !latest; }
  }

  function copyText(value, done) {
    const fallback = () => {
      const area = document.createElement('textarea');
      area.value = value;
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      try { document.execCommand('copy'); } catch (error) { }
      area.remove();
      done();
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(value).then(done, fallback);
      return;
    }
    fallback();
  }

  function copyUpdate() {
    copyText(UPDATE_COMMAND, () => {
      if (refs.update && state.update) {
        refs.update.textContent = 'Copied';
        setTimeout(() => { refs.update.textContent = 'v' + state.update.latest; }, 1600);
      }
      if (refs.updateCopy) {
        refs.updateCopy.textContent = 'Copied';
        setTimeout(() => { refs.updateCopy.textContent = 'Copy update command'; }, 1600);
      }
    });
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
    const images = artist.images && artist.images.length ? artist.images : (artist.image ? [artist.image] : []);
    if (images.length) {
      const gallery = document.createElement('div');
      gallery.className = 'sum-gallery';
      const image = document.createElement('img');
      image.className = 'sum-artist-image';
      image.alt = artist.name;
      image.loading = 'lazy';
      gallery.appendChild(image);

      let index = 0;
      const thumbs = [];
      const counter = document.createElement('span');
      counter.className = 'sum-gallery-count';

      const show = (next) => {
        index = ((next % images.length) + images.length) % images.length;
        image.src = images[index];
        counter.textContent = (index + 1) + ' / ' + images.length;
        thumbs.forEach((thumb, position) => thumb.classList.toggle('is-active', position === index));
      };

      if (images.length > 1) {
        const prev = document.createElement('button');
        prev.type = 'button';
        prev.className = 'sum-gallery-nav sum-gallery-prev';
        prev.setAttribute('aria-label', 'Previous image');
        prev.textContent = '\u2039';
        prev.addEventListener('click', () => show(index - 1));

        const next = document.createElement('button');
        next.type = 'button';
        next.className = 'sum-gallery-nav sum-gallery-next';
        next.setAttribute('aria-label', 'Next image');
        next.textContent = '\u203a';
        next.addEventListener('click', () => show(index + 1));

        gallery.appendChild(prev);
        gallery.appendChild(next);
        gallery.appendChild(counter);

        const strip = document.createElement('div');
        strip.className = 'sum-thumbs';
        images.forEach((source, position) => {
          const thumb = document.createElement('button');
          thumb.type = 'button';
          thumb.className = 'sum-thumb';
          thumb.setAttribute('aria-label', 'Show image ' + (position + 1));
          const preview = document.createElement('img');
          preview.src = source;
          preview.alt = '';
          preview.loading = 'lazy';
          thumb.appendChild(preview);
          thumb.addEventListener('click', () => show(position));
          strip.appendChild(thumb);
          thumbs.push(thumb);
        });
        gallery.appendChild(strip);
      }

      show(0);
      hero.appendChild(gallery);
    }
    const factMap = new Map((artist.facts || []).map(([label, value]) => [label, value]));

    const head = document.createElement('div');
    head.className = 'sum-artist-head';
    const heading = document.createElement('h2');
    heading.className = 'sum-artist-name';
    heading.textContent = artist.name;
    head.appendChild(heading);
    if (artist.spotifyUrl) {
      const open = document.createElement('a');
      open.className = 'sum-artist-open';
      open.href = artist.spotifyUrl;
      open.target = '_blank';
      open.rel = 'noreferrer noopener';
      open.textContent = 'Spotify';
      head.appendChild(open);
    }
    hero.appendChild(head);

    const meta = document.createElement('div');
    meta.className = 'sum-artist-meta';
    const badge = document.createElement('span');
    badge.className = 'sum-artist-badge';
    badge.textContent = 'Artist';
    meta.appendChild(badge);
    const metaBits = [factMap.get('Country'), factMap.get('Active'), factMap.get('Genres')].filter(Boolean);
    const metaText = document.createElement('span');
    metaText.className = 'sum-artist-meta-text';
    metaText.textContent = metaBits.length ? metaBits.join(' · ') : 'Unknown';
    meta.appendChild(metaText);
    hero.appendChild(meta);
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

    const list = document.createElement('div');
    list.className = 'sum-facts';
    for (const label of FACT_ORDER) {
      const value = factMap.get(label) || 'Unknown';
      const row = document.createElement('div');
      row.className = 'sum-fact';
      const key = document.createElement('span');
      key.className = 'sum-fact-key';
      key.textContent = label;
      const val = document.createElement('span');
      val.className = 'sum-fact-value';
      if (value === 'Unknown') { val.classList.add('is-unknown'); }
      val.textContent = value;
      row.appendChild(key);
      row.appendChild(val);
      list.appendChild(row);
    }
    refs.artist.appendChild(list);

    if (artist.links && artist.links.length) {
      const links = document.createElement('div');
      links.className = 'sum-links';
      for (const link of artist.links) {
        const anchor = document.createElement('a');
        anchor.className = 'sum-link';
        anchor.href = link.url;
        anchor.target = '_blank';
        anchor.rel = 'noreferrer noopener';
        const icon = document.createElement('span');
        icon.className = 'sum-link-icon';
        icon.setAttribute('aria-hidden', 'true');
        icon.innerHTML = iconForLink(link.label);
        const text = document.createElement('span');
        text.textContent = link.label;
        anchor.appendChild(icon);
        anchor.appendChild(text);
        links.appendChild(anchor);
      }
      refs.artist.appendChild(links);
    }

    const note = document.createElement('div');
    note.className = 'sum-note';
    note.textContent = 'Sources: Wikipedia, Wikidata and Spotify. Missing details are shown as Unknown.';
    refs.artist.appendChild(note);
  }

  let loopBusy = false;
  function loop() {
    if (loopBusy) { return; }
    loopBusy = true;
    try {
      syncTrack();
      ensurePlayerButton();
      decorateAllMenus();
      if (state.open && state.tab === 'lyrics' && state.lines.length) {
        updateActive(false);
      }
    } catch (error) { }
    finally { loopBusy = false; }
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
    linkIcon: iconForLink,
    lookupArtist: (name) => findMusicEntity(name).then((match) => match ? { qid: match.qid, title: match.title, description: entityDescription(match.entity) } : null),
    checkUpdate: checkForUpdate,
    previewArtist: (name, url) => loadArtistFor(name, url || ''),
    refreshArtist: loadArtistForCurrent,
    refresh: window.__SUM_REFRESH__
  };

  return 'ok';
})();
