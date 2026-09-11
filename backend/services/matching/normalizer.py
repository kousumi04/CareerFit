# A maintainable dictionary of common aliases mapped to a root concept
SKILL_ALIASES = {
    "postgres": "postgresql",
    "reactjs": "react",
    "react.js": "react",
    "node.js": "nodejs",
    "node": "nodejs",
    "aws": "amazon web services",
    "restful apis": "rest api",
    "rest apis": "rest api",
    "rest services": "rest api",
    "python 3": "python",
    "js": "javascript",
    "ts": "typescript",
    "machine learning": "ml",
    "artificial intelligence": "ai",
    "k8s": "kubernetes"
}

def normalize_skill(skill: str) -> str:
    """Converts a skill string to its normalized lowercase root."""
    cleaned = skill.strip().lower()
    # Return the mapped alias if it exists, otherwise return the cleaned string
    return SKILL_ALIASES.get(cleaned, cleaned)