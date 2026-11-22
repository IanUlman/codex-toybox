# Codex Toybox 🎮

A permanent, zero-dependency playground for browser-game experiments. Each game lives in `games/<slug>/` and has its own entry point. The homepage automatically builds a game list from `games.json`.

**Play locally:** from repository root run `python3 -m http.server 8000 --bind 0.0.0.0` and open `http://localhost:8000/`. No `npm install`, bundler, or setup script required.

**Add a new game with Codex:** select this repository's published Codex Cloud environment, then ask:

> Build a new mobile-friendly browser game called [idea]. Put it in its own new folder under `games/`; do not touch existing games. Update `games.json`, run `python3 scripts/check.py`, and verify the game works. Use no backend or external dependencies unless necessary.

Detailed agent rules are in `AGENTS.md`. The empty starting point is `templates/vanilla/index.html`.

## Publish the games on your phone

For a public repository, go to **Settings → Pages → Build and deployment** and choose **Deploy from a branch**, branch **main**, directory **/ (root)**. Save. After the initial deployment and subsequent commits to `main`, the homepage will be available at:

`https://<your-github-username>.github.io/<repository-name>/`

Each game gets a corresponding link under `games/<slug>/`. GitHub Pages URLs are public; don't deploy private information.

New Codex task workspaces are separate. To publish an experiment, commit or merge its changes into `main`; simply creating files in a task workspace does not deploy them.

## Structure

- `index.html` — the toybox homepage
- `games.json` — catalog of games shown on the homepage
- `games/tap-rush/index.html` — sample complete browser game
- `templates/vanilla/index.html` — copy this when starting a new one
- `AGENTS.md` — permanent Codex instructions
- `scripts/check.py` — fast sanity checks