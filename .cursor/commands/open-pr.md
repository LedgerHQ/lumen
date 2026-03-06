# open-pr

Open a PR from the current branch to `main`. Commit if needed, push, then create the PR with a filled-in description and testing steps.

## Step 0: Ensure we are on a feature branch

Run `git branch --show-current` to check the current branch. If the current branch is `main`:

1. Generate a descriptive branch name from the uncommitted changes or ask the user.
2. Create and switch to the new branch:
   ```bash
   git checkout -b <branch-name>
   ```
3. Continue with Step 1.

If already on a feature branch, continue directly.

## Step 1: Create a commit if needed

- If `git status` shows **uncommitted changes** (staged or unstaged):
  - Summarise the diff in one short sentence.
  - Propose a conventional commit message (e.g. `feat(select): add custom trigger support`).
  - Run:
    ```bash
    git add -A
    git commit -m "Your proposed message"
    ```
  - If the user has a different preference for the message, use that instead.
- If everything is already committed, skip to Step 2.

## Step 2: Push the branch

Push the branch to the remote (or update it if already pushed):

```bash
git push -u origin HEAD
```

## Step 3: Check for an existing PR

Before creating a new PR, check if one already exists for this branch:

```bash
gh pr view --json url
```

- If a PR already exists, skip creation. Print the existing PR URL and ask the user if they'd like to update its title or description.
- If no PR exists (`no pull requests found` error), continue to Step 4.

## Step 4: Prepare PR body

1. **Generate the PR body** using the following structure:

   ```markdown
   ## Description

   <!-- Focus on WHY the change is being made — the motivation, problem, or goal.
        Briefly mention what was done only to give context for the why.
        If the change is UI-related, remind to add screenshots. -->

   ## How to test

   <!-- Add concrete testing steps derived from the changed code.
        e.g. which screen to open, what to tap, what to expect.
        Must be specific enough for a reviewer to follow. -->

   ## Screenshots

   <!-- Before/after screenshots if UI change, otherwise N/A -->
   ```

2. **Fill in the template:**
   - **Description:** Analyse the diff against `main` (`git diff main...HEAD`). Write a description focused on *why* the change is being made. Briefly mention *what* was done to give context.
   - **How to test:** Derive concrete, specific testing steps from the changed code (e.g. which screen to open, what to interact with, what to expect).
   - **Screenshots:** If the change is UI-related, add "Add before/after screenshots here"; otherwise write "N/A".

3. **Linear issue:** Try to infer a Linear issue ID from the branch name. Run `git branch --show-current` and look for a pattern: a short alphanumeric prefix (1–4 characters) followed by a hyphen and a number (e.g. `AND-12345`, `REV-42`, `FAN1-99`). The match is case-insensitive. If found, uppercase the prefix and append a line to the description: `refs [PREFIX-123](https://linear.app/ledger/issue/PREFIX-123)`. If no issue ID can be extracted, skip this.

4. **Save the body** to `/tmp/pr-body.md`.

## Step 5: Create the PR with GitHub CLI

1. **Generate a PR title** based on the changes using a conventional commit prefix. Pick the most appropriate prefix:
   - `feat` — new feature or user-facing addition
   - `fix` — bug fix
   - `refactor` — code restructuring without behaviour change
   - `chore` — maintenance, dependency updates, CI changes
   - `docs` — documentation only
   - `test` — adding or updating tests
   - `style` — formatting, whitespace, etc.

   Include an optional scope in parentheses when it helps clarify the area (e.g. `feat(select): ...`, `fix(button): ...`).
   The title should be a concise, human-readable summary.

2. **Run:**

   ```bash
   gh pr create --title "<generated title>" --base main --body-file /tmp/pr-body.md
   ```

   If `gh` is not installed or not authenticated, tell the user to install the [GitHub CLI](https://cli.github.com/) and run `gh auth login`, then rerun the command.

3. **Output the PR link.** After the PR is created, print a clickable link to the PR URL.

4. **Clean up** by deleting `/tmp/pr-body.md`.

## Summary

1. Ensure we are on a feature branch (create one if on `main`).
2. If there are uncommitted changes, create a commit with a clear conventional message.
3. Push the branch to the remote.
4. Check if a PR already exists — if so, skip creation and offer to update it.
5. Build the PR body with Description (why), How to test (concrete steps), Screenshots, and auto-linked Linear issue.
6. Run `gh pr create --base main --body-file /tmp/pr-body.md` and output a clickable link to the created PR.
7. Delete the temporary body file.
