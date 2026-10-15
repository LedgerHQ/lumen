---
name: open-pr
description: >-
  Open a PR from the current branch to `main`: find the DLS ticket in the
  current sprint, ensure an Nx version plan exists, commit, push, and create the
  PR from the repo's PR template. Run only when the user explicitly asks to
  open/create a PR.
disable-model-invocation: true
---

# open-pr

Run the whole flow without asking for confirmation. Only stop to ask where a
step says so, or when something fails.

## 1. Ticket and branch

Resolve the DLS key once; the title and the body both use it.

1. If the branch name contains `DLS-<n>` (any case), use it.
2. Otherwise run the current-sprint lookup from the `jira-ticket` skill and
   match the summaries against the branch name and the diff. Use a single clear
   match silently; otherwise ask one question with the top candidates plus
   "No ticket".
3. If the Jira tools are missing or unauthorized, ask once for the key or "No ticket".

On `main`, create the branch once the key is known:
`git checkout -b DLS-<n>-<short-slug>` (just `<short-slug>` without a ticket).

## 2. Commit

Commit any uncommitted changes with a conventional message, so every later
check sees the whole change.

## 3. Version plan

Run the same check as CI, against a fresh `origin/main`:

```bash
git fetch origin main && npx nx release plan:check --base=origin/main --verbose
```

It lists every affected publishable package that has no plan, and already
ignores tests, stories and docs (`nx.json` → `ignorePatternsForPlanCheck`). Add
one plan per listed package following the `release-plan` skill, commit them,
and rerun until it passes.

## 4. Push

Push to the branch's own name, never to its upstream (a branch created from
`origin/main` tracks `main`, and a bare push would target it):

```bash
git push -u origin "HEAD:refs/heads/$(git branch --show-current)"
```

If `gh pr view --json url` finds a PR, print its URL and stop.

## 5. Title

`<prefix> DLS-<n> <type>(<scope>): <summary>`, e.g. `[M] DLS-1023 feat(Toast): add Toast component`

- `<prefix>`: the platform prefix defined in the `jira-ticket` skill, derived
  from the changed libs.
- `<type>`: `feat`, `fix`, `refactor`, `chore`, `docs` or `test`, or
  `BREAKING_CHANGE` when consumers must change their code (removed or renamed
  export or prop, changed default).
- Without a ticket, drop `DLS-<n>`.

## 6. Body

Fill `.github/pull_request_template.md` from `git diff origin/main...HEAD`, then strip
every HTML comment:

- **Context**: the why, readable by someone who won't open the code. Set the
  ticket link, or remove that line without a ticket.
- **Technical details**: what changed and where to start reviewing, about 5
  bullets at most, never a file-by-file list. A fix states the root cause, a
  feature shows a short usage snippet, an architectural change links its ADR in
  `docs/adr/`.
- **How to test**: concrete steps or story names, and a reminder to add
  before/after screenshots for UI changes. Remove it when CI covers the change.
- **Breaking change**: uncomment and fill (before → after, migration) for
  `BREAKING_CHANGE`; remove it otherwise.

## 7. Create

```bash
gh pr create --base main --head "$(git branch --show-current)" --title "<title>" --body-file - <<'EOF'
<body>
EOF
```

Print the PR URL. If `gh` is missing or unauthenticated, tell the user to install
the [GitHub CLI](https://cli.github.com/) and run `gh auth login`.
