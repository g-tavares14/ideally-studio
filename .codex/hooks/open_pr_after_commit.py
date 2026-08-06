#!/usr/bin/env python3
"""Cria um PR draft depois de um `git commit` bem-sucedido executado pelo Codex."""

from __future__ import annotations

import json
import re
import shutil
import subprocess
import sys


def run(*args: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run(args, check=False, capture_output=True, text=True)


def is_successful_git_commit(payload: dict[str, object]) -> bool:
    tool_input = payload.get("tool_input")
    tool_response = payload.get("tool_response")

    if not isinstance(tool_input, dict) or not isinstance(tool_response, dict):
        return False

    command = tool_input.get("command")
    exit_code = tool_response.get("exit_code")

    if not isinstance(command, str) or exit_code != 0:
        return False

    return bool(re.search(r"(?:^|[;&|]\s*)git\s+commit(?:\s|$)", command))


def main() -> int:
    try:
        payload = json.load(sys.stdin)
    except json.JSONDecodeError:
        return 0

    if not is_successful_git_commit(payload):
        return 0

    if shutil.which("gh") is None:
        return 0

    branch_result = run("git", "branch", "--show-current")
    branch = branch_result.stdout.strip()
    if not branch or branch in {"main", "master", "develop"}:
        return 0

    if run("gh", "auth", "status").returncode != 0:
        return 0

    remote_result = run("git", "remote", "get-url", "origin")
    if remote_result.returncode != 0:
        return 0

    base_result = run("git", "symbolic-ref", "--quiet", "--short", "refs/remotes/origin/HEAD")
    base_branch = base_result.stdout.strip().removeprefix("origin/") or "main"
    if branch == base_branch:
        return 0

    if run("git", "push", "-u", "origin", branch).returncode != 0:
        return 0

    pr_result = run("gh", "pr", "list", "--head", branch, "--state", "open", "--json", "url", "--jq", "length")
    if pr_result.returncode != 0 or pr_result.stdout.strip() != "0":
        return 0

    run("gh", "pr", "create", "--base", base_branch, "--draft", "--fill")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
