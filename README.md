# Spotify-Clone-Vibefy
🎵 Vibefy — A modern Spotify clone built with React &amp; Node.js featuring real-time music playback, playlists, dark mode, and responsive UI.
# Spotify-Clone — Vibefy

Vibefy is a simple, static Spotify-style clone built with HTML, CSS, and vanilla JavaScript. It showcases a clean music UI with artist pages, a basic audio player, and mobile-friendly styling — perfect for learning front‑end fundamentals.

## Features

- Static site: no backend or database required
- Artist-specific pages under `artists/`
- Basic audio player UI (play/pause/seek depending on the page logic)
- Organized local `songs/` folder by artist
- Responsive layout and custom styles

## Repository structure

Key files and folders:

- `vibefy_login.html` — login screen
- `signup.html` — sign-up screen
- `library.html` — main library/browse view
- `tempo.html` — additional page (tempo-related UI)
- `styles.css`, `login.css`, `signup.css` — global and page styles
- `script.js` — main site scripts
- `artists/` — per-artist pages and `artist-style.css`, `artist-player.js`
- `songs/` — audio files organized per artist
- `Spotify-codes.txt` — project notes/codes

Example (partial) tree:

```
artists/
	ariana.html
	badbunny.html
	drake.html
	edsheeran.html
	taylor.html
	weeknd.html
songs/
	ariana/
	bad bunny/
	drake/
	ed sharren/
	taylor swift/
	weekend/
```

## Quick start

Because this is a static website, you can open pages directly in the browser or serve the folder with a simple local server (recommended), which avoids path/cors issues and mirrors production hosting.

Option A — VS Code Live Server (recommended):
1) Install the "Live Server" extension in VS Code.
2) Open the workspace folder.
3) Right‑click `vibefy_login.html` (or `library.html`) and choose "Open with Live Server".

Option B — Python (if installed):

```powershell
cd "d:\SICSR\project\Vibefy"
python -m http.server 8000
# Open http://localhost:8000/ in your browser
```

Option C — Node.js http-server (if Node.js installed):

```powershell
cd "d:\SICSR\project\Vibefy"
npx http-server -p 8000
# Open http://localhost:8000/
```

## Using the app

- Start from `vibefy_login.html` or open `library.html` to browse.
- Visit an artist page in `artists/` to play songs for that artist.
- The `songs/` folder holds audio files; some pages may reference hard-coded paths.

## Adding artists and songs

1. Create a new HTML file under `artists/` for the artist (copy one of the existing pages as a template).
2. Create a folder inside `songs/` matching the artist name (use the existing naming pattern).
3. Add `.mp3` (or supported) files in that folder.
4. Update the song list references in the relevant artist page and/or `artist-player.js` / `script.js` so the UI can find and play the files.

## Tech stack

- HTML5, CSS3
- Vanilla JavaScript

## Contributing

This is a learning/demo project. Contributions are welcome:

- Fork the repo and create a feature branch.
- Keep changes focused (e.g., add an artist page, refine styles, improve accessibility).
- Open a pull request with a clear description and screenshots if visual changes.

Nice-to-have ideas:
- Centralize song metadata in a JSON file and load dynamically.
- Add keyboard shortcuts and improved focus states.
- Add a minimal test harness for any extracted JS utilities.

## License

This project is for educational purposes and not affiliated with Spotify. If you plan to reuse or distribute, consider adding an open-source license (e.g., MIT) to this repository.

## Acknowledgements

Inspired by Spotify’s UI and user experience. All trademarks are property of their respective owners.
