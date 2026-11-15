# Spotify Ultimate Mod

**Lyrics, translation, artist intelligence and themes — injected directly into the Spotify desktop client.**

One command installs it. Nothing else to download, no Node.js, no build tools, no account setup.

```powershell
irm https://github.com/nykl3ar-max/spotify-ultimate-mod-injector/raw/refs/heads/main/install.ps1 | iex
```

After it finishes, Spotify opens with the mod active. Press **Ctrl+Shift+U** or click the **Ultimate** button to open the panel.

> Independent project. Not affiliated with, endorsed by or sponsored by Spotify AB. Read [Good to know](#good-to-know) before installing.

---

## What it adds

| Feature | Details |
| --- | --- |
| **Synced lyrics** | Time-aligned lyrics from LRCLIB, active line highlighted, auto-scroll, click-free reading |
| **Automatic translation** | Translates the playing lyrics into 30 languages, original and translation side by side, per-line cache |
| **Artist panel** | Verified biography, portrait, birth details, country, genres, profession, label and verified links from Wikipedia and Wikidata |
| **Themes** | Six colour themes plus a custom accent, applied to the entire Spotify interface instantly |
| **Custom CSS** | Style any part of Spotify from the panel; imports and remote URLs are stripped for safety |
| **Zero footprint on disk** | Spotify's files are never patched. The interface is injected into the running app and disappears on restart |

---

## Install

1. Open **Windows PowerShell** (no administrator rights needed).
2. Paste:

```powershell
irm https://github.com/nykl3ar-max/spotify-ultimate-mod-injector/raw/refs/heads/main/install.ps1 | iex
```

3. Wait for `Spotify Ultimate Mod is ready.`

The installer:

- finds your Spotify installation;
- downloads the mod files to `%LOCALAPPDATA%\SpotifyUltimateMod`;
- creates **Desktop** and **Start Menu** launchers;
- starts Spotify with its Chromium debugging port enabled;
- injects the interface and starts a small background watcher that re-injects after a reload.

Use the **Spotify Ultimate Mod** shortcut from then on so Spotify always starts ready for injection. Launching Spotify the normal way still works; run the shortcut once afterwards to bring the mod back.

### Updating

Run the install command again. Files are replaced and the watcher restarts.

### Uninstalling

```powershell
irm https://github.com/nykl3ar-max/spotify-ultimate-mod-injector/raw/refs/heads/main/uninstall.ps1 | iex
```

This removes the launchers and mod files. Spotify itself is untouched; the mod is gone the next time Spotify starts normally.

---

## Using the panel

| Control | What it does |
| --- | --- |
| **Lyrics** tab | Synced lyrics for the current track, with language and display-mode selectors (`Both languages`, `Translated only`, `Original only`) and font size buttons |
| **Artist** tab | Portrait, biography, documented facts and verified links for the current artist |
| **Style** tab | Six themes, custom accent colour, auto-scroll toggle and a custom CSS box with Apply/Reset |
| **Ctrl+Shift+U** | Open or close the panel |
| **Ultimate button** | Same as the shortcut, for mouse users |

Settings, theme choice and translation cache are stored in Spotify's own local storage, so they survive restarts.

### Themes

Midnight (violet), AMOLED (true black, mint), Neon (magenta), Ocean (cyan), Crimson (red) and Aurora (green). Theme colours are applied through Spotify's own CSS variables, so every surface — sidebar, cards, player, menus — changes together.

### Custom CSS

The Style tab accepts CSS for the whole client. A few variables are available:

```css
:root {
  --background-base: #0b0b10;
  --text-base: #f5f5f7;
  --essential-bright-accent: #8b5cf6;
  --sum-accent: #8b5cf6;
}
```

The mod's own selectors are prefixed `sum-` (`#sum-panel`, `.sum-line`, `.sum-lyric-text`) if you want to restyle the panel itself. `@import`, `javascript:` and remote `url()` references are removed before the CSS is applied.

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
- **No DRM changes, no audio capture, no account changes.**
- **Nothing is uploaded** except the queries needed for lyrics, translation and artist data. No analytics, no telemetry.

---

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `Spotify was not found` | Install the desktop app from spotify.com, then run the command again. |
| Panel does not appear | Close Spotify, then open the **Spotify Ultimate Mod** shortcut. |
| Nothing happens after a Spotify update | Run the install command again, then reopen the shortcut. |
| Lyrics say "No lyrics were found" | LRCLIB has no record for that track; try another version of the song. |
| Translation stops partway | Google's public endpoint is rate limited. Wait a minute and reopen the panel; already translated lines are cached. |
| Artist panel is empty | Wikipedia/Wikidata has no article for that artist, or the network is blocked. |
| Spotify starts without the panel | It was started from its own shortcut. Close it and use the **Spotify Ultimate Mod** shortcut. |
| Logs | `%LOCALAPPDATA%\SpotifyUltimateMod\injector.log` |

---

## Project layout

```text
spotify-ultimate-mod-injector/
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
