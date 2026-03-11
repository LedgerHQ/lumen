# open-pr

Open a PR from the current branch to `main`. Commit if needed, push, then create the PR with a filled-in description and testing steps.

**Important: Do NOT ask for confirmation at any step.** Run the entire flow automatically from start to finish. Only stop and ask the user if something fails or if the branch is `main` and you need a branch name.

## Step 0: Ensure we are on a feature branch


Run `git branch --show-current` to check the current branch.

- If already on a feature branch: **skip to Step 1**
- If on `main`: Ask the user for a Jira ticket number, generate a descriptive branch name from uncommitted changes, then create and switch to `DLS-<number>-<branch-name>`:
  ```bash
  git checkout -b DLS-<number>-<branch-name>
  ```



## Step 1: Ensure an Nx version plan exists

Run:
```bash
git diff main...HEAD --name-only -- .nx/version-plans/
```
- If the output is non-empty, a version plan already exists — **skip to Step 2**.
- Otherwise, create one. Determine which packages are affected by looking at the changed files (`git diff main...HEAD --name-only`):

- Files under `libs/ui-react/` → `'@ledgerhq/lumen-ui-react'`
- Files under `libs/ui-rnative/` → `'@ledgerhq/lumen-ui-rnative'`
- Files under `libs/design-core/` → `'@ledgerhq/lumen-design-core'`
- Files under `libs/utils-shared/` → `'@ledgerhq/lumen-utils-shared'`

Pick the bump type based on the change:
- `patch` — bug fixes, small tweaks
- `minor` — new features, new components, new props
- `major` — breaking changes

Write the file as `.nx/version-plans/version-plan-<timestamp>.md` with this format:

```markdown
---
'@ledgerhq/lumen-ui-rnative': minor
---

feat(Select): add render prop and SelectButtonTrigger
```

The description line should match the PR title / commit message style. If multiple packages are affected, list them all in the frontmatter.

## Step 2: Create a commit if needed

- If `git status` shows nothing to commit, **skip to Step 3**.

- If `git status` shows **uncommitted changes** (staged or unstaged):
  - Summarise the diff in one short sentence.
  - Generate a conventional commit message (e.g. `feat(select): add custom trigger support`).
  - Run immediately without asking for confirmation:
    ```bash
    git add -A
    git commit -m "Your generated message"
    ```

## Step 3: Push the branch

Push the branch to the remote (or update it if already pushed):

```bash
git push -u origin HEAD
```

## Step 4: Check for an existing PR

Run:
```bash
gh pr view --json url
```
- If a PR already exists, print the existing PR URL and **stop**.
- Otherwise, continue to Step 5.

## Step 5: Prepare PR body

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

3. **Jira issue:** The branch name was already ensured to contain a `DLS-<number>` prefix in Step 0. Extract it from `git branch --show-current` using the pattern `DLS-\d+`. It will be included in the PR title in Step 6 — no action needed here.

4. **Save the body** to `/tmp/pr-body.md`.

## Step 6: Create the PR with GitHub CLI

1. **Generate a PR title** by combining the Jira ticket ID extracted in Step 5 with a conventional commit message. Format: `DLS-<number> <prefix>(<scope>): <summary>`. Pick the most appropriate prefix:
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
2. Ensure an Nx version plan exists in `.nx/version-plans/` — create one if missing, based on affected packages and change type.
3. If there are uncommitted changes, create a commit with a clear conventional message.
4. Push the branch to the remote.
5. Check if a PR already exists — if so, skip creation and print the URL.
6. Build the PR body with Description (why), How to test (concrete steps), and Screenshots.
7. Run `gh pr create --base main --body-file /tmp/pr-body.md` and output a clickable link to the created PR.
8. Delete the temporary body file.
