#!/usr/bin/env python3
"""Validate the Codex Toybox catalog and its static entry points."""
from pathlib import Path
import json
import re
import sys

root = Path(__file__).resolve().parent.parent
errors = []
try:
    games = json.loads((root / "games.json").read_text(encoding="utf-8"))
except (OSError, json.JSONDecodeError) as exc:
    print(f"FAIL: cannot parse games.json: {exc}")
    sys.exit(1)
if not isinstance(games, list):
    errors.append("games.json must contain an array")
    games = []
slugs = set()
for i, game in enumerate(games):
    if not isinstance(game, dict):
        errors.append(f"Game {i} must be an object")
        continue
    slug = game.get("slug")
    if not isinstance(slug, str) or not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", slug):
        errors.append(f"Game {i} has an invalid slug: {slug!r}")
        continue
    if slug in slugs:
        errors.append(f"Duplicate slug: {slug}")
    slugs.add(slug)
    for field in ("title", "description"):
        if not isinstance(game.get(field), str) or not game[field].strip():
            errors.append(f"Game {slug} needs nonempty {field}")
    if not (root / "games" / slug / "index.html").is_file():
        errors.append(f"Game {slug} is missing games/{slug}/index.html")
for folder in (root / "games").iterdir():
    if folder.is_dir() and (folder / "index.html").is_file() and folder.name not in slugs:
        errors.append(f"Game folder {folder.name} is missing from games.json")
for name in ("index.html", "AGENTS.md", "README.md"):
    if not (root / name).is_file():
        errors.append(f"Missing {name}")
if errors:
    for error in errors:
        print("FAIL:", error)
    sys.exit(1)
print(f"PASS: {len(games)} game(s) registered; entry points and catalog look good")
