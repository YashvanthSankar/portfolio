"""Refresh public/repos.json from the GitHub API.

Usage:
    npm run repos                      # unauthenticated, 60 req/hr
    GITHUB_TOKEN=ghp_… npm run repos   # authenticated, 5000 req/hr

Writes straight into public/ so the /work page picks it up — no manual
copy step, which is how the old script's output drifted out of sync.
"""

import json
import os
import pathlib
import sys
import urllib.error
import urllib.request

USERNAME = "YashvanthSankar"
OUT_PATH = pathlib.Path(__file__).resolve().parent.parent / "public" / "repos.json"
API = f"https://api.github.com/users/{USERNAME}/repos?per_page=100&sort=updated"


def fetch(url: str) -> list[dict]:
    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": f"{USERNAME}-portfolio",
    }
    token = os.environ.get("GITHUB_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"

    request = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            return json.load(response)
    except urllib.error.HTTPError as err:
        detail = "rate limited — set GITHUB_TOKEN" if err.code == 403 else err.reason
        sys.exit(f"GitHub API error {err.code}: {detail}")
    except urllib.error.URLError as err:
        sys.exit(f"Network error: {err.reason}")


def main() -> None:
    repos = [
        {
            "name": repo["name"],
            "description": repo["description"],
            "url": repo["html_url"],
            "language": repo["language"],
            "stars": repo["stargazers_count"],
            "forks": repo["forks_count"],
            "topics": repo.get("topics", []),
            "created_at": repo["created_at"],
            "updated_at": repo["updated_at"],
        }
        for repo in fetch(API)
        if not repo.get("fork") and not repo.get("archived")
    ]

    OUT_PATH.write_text(json.dumps(repos, indent=2) + "\n")
    print(f"Wrote {len(repos)} repositories to {OUT_PATH.relative_to(pathlib.Path.cwd())}")


if __name__ == "__main__":
    main()
