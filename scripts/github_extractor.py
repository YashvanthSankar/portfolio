import requests
import json

username = "YashvanthSankar"
url = f"https://api.github.com/users/{username}/repos"

response = requests.get(url)
repos = response.json()

# Extract key info
repo_list = []
for repo in repos:
    repo_info = {
        "name": repo["name"],
        "description": repo["description"],
        "url": repo["html_url"],
        "language": repo["language"],
        "stars": repo["stargazers_count"],
        "forks": repo["forks_count"],
        "topics": repo.get("topics", []),
        "created_at": repo["created_at"],
        "updated_at": repo["updated_at"]
    }
    repo_list.append(repo_info)

# Save to JSON
with open("repos.json", "w") as f:
    json.dump(repo_list, f, indent=2)

print(f"Extracted {len(repo_list)} repositories for {username}")