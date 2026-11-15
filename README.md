# Spotifine

**Lyrics, translation, artist intelligence and themes — injected directly into the Spotify desktop client.**

One command installs it. Nothing else to download, no Node.js, no build tools, no account setup.

```powershell
irm https://github.com/nykl3ar-max/spotifine/raw/refs/heads/main/install.ps1 | iex
```

After it finishes, Spotify opens with the mod active. Press **Ctrl+Shift+U** or click the mod's button in the player bar, next to Spotify's own lyrics button, to open the panel.

> Independent project. Not affiliated with, endorsed by or sponsored by Spotify AB. Read [Good to know](#good-to-know) before installing.

---

## What it adds

| Feature | Details |
| --- | --- |
| **Synced lyrics** | Time-aligned lyrics from LRCLIB, active line highlighted, auto-scroll, click-free reading |
| **Automatic translation** | Translates the playing lyrics into 249 languages, original and translation side by side, per-line cache |
| **Pronunciation** | Romanised pronunciation for non-Latin lyrics (romaji, romaja, pinyin and more), shown under each line |
| **Artist panel** | Verified biography, a scrollable photo gallery (arrows, counter and thumbnails), birth details, country, genres, profession, label and verified links with platform icons |
| **Themes** | Fourteen themes plus a live custom palette (base, surface, text and accent), with Solid, Glass and OLED surface modes applied across the client |
| **Custom CSS and HTML** | Restyle the whole client and inject your own markup from the panel; CSS imports/remote URLs, scripts, iframes and inline handlers are stripped |
| **Zero footprint on disk** | Spotify's files are never patched. The interface is injected into the running app and disappears on restart |

---

## Install

1. Open **Windows PowerShell** (no administrator rights needed).
2. Paste:

```powershell
irm https://github.com/nykl3ar-max/spotifine/raw/refs/heads/main/install.ps1 | iex
```

3. Wait for `Spotifine is ready.`

The installer:

- finds your Spotify installation;
- downloads the mod files to `%LOCALAPPDATA%\Spotifine`;
- creates **Desktop** and **Start Menu** launchers;
- starts Spotify with its Chromium debugging port enabled;
- injects the interface and starts a small background watcher that re-injects after a reload.

Use the **Spotifine** shortcut from then on so Spotify always starts ready for injection. Launching Spotify the normal way still works; run the shortcut once afterwards to bring the mod back.

### Updating

Run the install command again. Files are replaced and the watcher restarts.

### Uninstalling

```powershell
irm https://github.com/nykl3ar-max/spotifine/raw/refs/heads/main/uninstall.ps1 | iex
```

This removes the launchers and mod files. Spotify itself is untouched; the mod is gone the next time Spotify starts normally.

---

## Translation and pronunciation

Translation follows the Lingo-lyrics approach: every line is translated in place, the translation sits directly under the original, and non-Latin scripts also get a romanised pronunciation line. The language picker is loaded live from Google Translate's public language list, so it offers the same broad coverage (249 languages, including regional variants) instead of a fixed short list.

- **Both languages** shows original, pronunciation and translation.
- **Translated only** and **Original only** switch the view instantly without refetching.
- Translations and pronunciations are cached per line, so replaying a track costs no requests.
- Language names are cached for a week, translations until the cache is cleared.

> **Credit:** the translation and pronunciation behaviour is modelled on [Lingo-lyrics](https://github.com/TheoreticallyBryChen/Lingo-lyrics) by TheoreticallyBryChen. Lingo is a proprietary, closed-source project with no public API, so none of its code, assets or branding is used or redistributed here; this is an independent implementation against the public Google Translate endpoint.

## Using the panel

| Control | What it does |
| --- | --- |
| **Lyrics** tab | Synced lyrics for the current track, with language and display-mode selectors (`Both languages`, `Translated only`, `Original only`), font size buttons and a pronunciation toggle in Style |
| **Artist** tab | Spotify-style header with gallery, name, artist badge and country/active/genres line; biography, every detail row shown (Unknown when missing) and verified links with logos, including Spotify and Wikidata |
| **Style** tab | Fourteen themes, Solid/Glass/OLED surface modes, live base/surface/text/accent colour pickers, theme reset, auto-scroll and pronunciation toggles, plus custom CSS and HTML boxes with Apply/Reset |
| **Updates** | Checks GitHub for a newer release and shows an update badge; clicking it copies the install command |
| **Ctrl+Shift+U** | Open or close the panel |
| **Player bar button** | Sits beside Spotify's own lyrics button and does the same as the shortcut |
| **Spotify menus** | Adds an **Spotifine settings** entry to the profile menu and to three-dot menus, opening the Style tab |

Settings, theme choice and translation cache are stored in Spotify's own local storage, so they survive restarts.

### Themes

Spotify (the default: `#121212` surfaces, white text, `#1ed760` green), Midnight (violet), AMOLED (true black, mint), Neon (magenta), Ocean (cyan), Crimson (red), Aurora (green), Nord (arctic blue-grey), Sunset (warm coral), Mono (neutral greyscale), Rose (pink), OLED (pure black for OLED displays), Glass (translucent blur over a themed gradient) and Custom.

Selecting any preset updates the whole client. Editing **Base**, **Surface** or **Text** switches to the Custom theme and applies live; the **Accent** picker recolours controls on any theme. Derived shades (tinted rows, elevated hovers, subdued text) are generated from those four colours, and **Reset theme** returns to Spotify. The palette is stored in Spotify's local storage and restored on restart.

### Surfaces

The **Surface** control works with any palette:

- **Solid** — flat theme colours on the main view, left sidebar, right panel, player bar and nav bar.
- **Glass** — a themed gradient backdrop with translucent, blurred main view, sidebar, player, card, menu and dialog surfaces.
- **OLED** — forces every themed surface to `#000000` with no blur, for true-black displays.

The surface mode and palette are applied to Spotify's own containers, cards, menus and dialogs — not just the mod's panel.

Theme values are also forced onto Spotify's own theme wrappers, so the base surface, sidebars, cards, player, menus, dialogs and listboxes follow the selected theme instead of staying on Spotify's defaults. Artwork-derived header gradients are left intact.

The panel itself uses Spotify's design language rather than its own: SpotifyMixUI typography, 8px panels with matching gaps, `#121212` surfaces, pill buttons and the same green accent, so it reads as part of the client instead of an overlay.

### Custom CSS and HTML

The Style tab accepts CSS for the whole client and HTML for a custom widget layer. A few variables are available in CSS:

```css
:root {
  --background-base: #121212;
  --text-base: #ffffff;
  --essential-bright-accent: #1ed760;
  --sum-accent: #1ed760;
}
```

The mod's own selectors are prefixed `sum-` (`#sum-panel`, `.sum-line-text`, `.sum-line-trans`) if you want to restyle the panel itself. `@import`, `javascript:` and remote `url()` references are removed before the CSS is applied.

Custom HTML is rendered into a container with the id `sum-custom-html`, docked at the bottom left above the player. Style or reposition it with custom CSS:

```html
<div class="my-widget">Now playing: your own content here</div>
```

```css
#sum-custom-html { left: auto; right: 16px; bottom: 96px; }
.my-widget { padding: 12px; border-radius: 8px; background: #1f1f1f; color: #fff; }
```

`<script>`, `<style>`, `<iframe>`, `<object>`, `<embed>`, `javascript:` URLs and inline `on*` handlers are stripped from custom HTML.

---

## How it works

1. Spotify's desktop client is a Chromium application. It accepts `--remote-debugging-port` and `--remote-allow-origins`.
2. The launcher starts Spotify with those flags (restarting it once if it was already open).
3. A PowerShell script connects to the DevTools protocol over a loopback WebSocket.
4. It evaluates a payload that builds the panel, reads the current track from the player, and fetches lyrics and artist data.
5. A watcher re-injects after Spotify reloads or updates the page.

No files inside the Spotify installation are written, patched or replaced. No audio is downloaded or decrypted. Playback is controlled by Spotify itself and continues normally.

Data sources:

| Source | Used for |
| --- | --- |
| [LRCLIB](https://lrclib.net) | Synced and plain lyrics |
| [Wikipedia](https://www.wikipedia.org) | Biography, portrait, article links |
| [Wikimedia Commons](https://commons.wikimedia.org) | Additional artist photos for the gallery |
| [Wikidata](https://www.wikidata.org) | Birth details, country, genres, profession, label, official links |
| Google Translate public endpoint | Lyric translation |

---

## Good to know

- **Spotify's terms.** Spotify does not officially support interface modifications. This project changes nothing on disk, but using it is still a modification of the client's runtime. Use it at your own risk; your account and installation are your responsibility.
- **Windows only.** Built and tested against the Spotify desktop client for Windows.
- **Spotify updates.** A Spotify update can change internal markup and break track detection. The mod fails soft: the panel stays available and shows a message instead of breaking Spotify.
- **Lyrics depend on LRCLIB coverage.** Obscure tracks, brand-new releases and some regional versions may be missing or unsynchronized.
- **Translation is machine translation.** Google's public endpoint is unofficial, rate limited and has no service guarantee.
- **Artist data is English-first** and only shows documented facts. Missing information is shown as unavailable rather than invented.
- **Artist matching** resolves names through Wikidata and only accepts entities whose occupation or group type is music-related. Exact but unrelated articles (for example *Bushido*, the samurai code, instead of the German rapper) are ignored, and the tab shows no biography rather than the wrong one.
- **No DRM changes, no audio capture, no account changes.**
- **Nothing is uploaded** except the queries needed for lyrics, translation and artist data. No analytics, no telemetry.
- **Resilience.** Requests time out after 12 seconds and retry once on network or server errors; stale artist responses are discarded, and lyric/artist caches are capped so long sessions stay stable.
- **Updates.** The panel reads `version.txt` from the repository at startup and every six hours. When a newer version exists, a badge appears in the header and the Style tab offers a one-click copy of the install command; a failed check never interrupts playback.

---

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `Spotify was not found` | Install the desktop app from spotify.com, then run the command again. |
| Panel does not appear | Close Spotify, then open the **Spotifine** shortcut. |
| Nothing happens after a Spotify update | Run the install command again, then reopen the shortcut. |
| Lyrics say "No lyrics were found" | LRCLIB has no record for that track; try another version of the song. |
| Translation stops partway | Google's public endpoint is rate limited. Wait a minute and reopen the panel; already translated lines are cached. |
| Artist panel is empty | Wikipedia/Wikidata has no article for that artist, or the network is blocked. |
| Spotify starts without the panel | It was started from its own shortcut. Close it and use the **Spotifine** shortcut. |
| Logs | `%LOCALAPPDATA%\Spotifine\injector.log` |

---

## Project layout

```text
spotifine/
├── install.ps1          One-command installer
├── uninstall.ps1        Removes launchers and files
├── src/
│   ├── common.ps1       Spotify detection, DevTools helpers
│   ├── injector.ps1     Attach, inject and watch
│   ├── payload.js       Injected interface (lyrics, artist, themes)
│   └── theme.css        Panel styling
├── LICENSE
└── README.md
```

Development: run `powershell -ExecutionPolicy Bypass -File .\src\injector.ps1 -NoRestart` against a Spotify instance started with `--remote-debugging-port=9222 --remote-allow-origins=http://localhost:9222`.

---

## Privacy

- The mod reads the current track title and artist from the Spotify window.
- Those values are sent only to LRCLIB, and the artist name to Wikipedia and Wikidata.
- Lyrics are sent to the translation endpoint only when translation is enabled.
- Settings stay in Spotify's local storage on your PC.
- No account credentials, tokens or playback history are read or stored.

---

## License

[MIT](LICENSE). Spotify and the Spotify logo are trademarks of Spotify AB. Lyrics and artist data belong to their respective owners.

---

## Support

If this project is useful to you, you can optionally [buy me a coffee](https://ko-fi.com/nykl3ar). Donations are entirely optional and no feature is locked behind them.
