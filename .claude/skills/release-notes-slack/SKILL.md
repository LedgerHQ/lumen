---
name: release-notes-slack
description: >-
  Turn raw Lumen release content (a dump of the LedgerHQ/lumen GitHub Releases
  page) into one minimalist Slack announcement, drafted to #lumen-releases. Use
  whenever the user pastes one or more `@ledgerhq/lumen-*` package releases, a
  chunk of the Releases page, or asks to "announce", "format", "post", or "write
  release notes / a Slack message" for new Lumen versions. Trigger it even when
  the user just drops the raw release text with no instructions, or says things
  like "new Lumen release", "format these lumen versions for Slack", or "lumen
  changelog for the channel".
---

# Release notes (Slack announcement)

Lumen ships from one monorepo (`LedgerHQ/lumen`) as a set of `@ledgerhq/lumen-*`
packages. Releases are coordinated, so the GitHub Releases page lists each
package separately with heavily overlapping changes. Compress that into **one**
minimalist Slack message in a fixed format, so every announcement in the channel
looks identical.

This is for announcing a release that already shipped. Preparing one — the Nx
version plans that cause the bump — is the `release-plan` skill.

## Write standard Markdown, never Slack mrkdwn

The message goes out through the Slack connector, which takes standard Markdown
and converts it itself. Pre-converting to Slack's "mrkdwn" dialect is the most
common way this goes wrong: the connector passes it through untouched and the
channel sees raw markup.

| Write this          | Not this            |
| ------------------- | ------------------- |
| `**bold**`          | `*bold*`            |
| `[#774](https://…)` | `<https://…\|#774>` |
| `-` bullets         | a literal `•`       |

## Output format

```
**Lumen — New Releases** · {RELEASE_DATE}

**Packages updated**
- `{full-package-name}@{version}`

**Changes**
- {change summary} ([#{PR}](https://github.com/LedgerHQ/lumen/pull/{PR}))

**Breaking changes**
None.
```

No decorative emoji — the bold headers carry the structure, and the title stays
constant. The date goes in the header; if a dump spans several, use the most
recent.

**Packages updated** is a pure version list — one bullet per released package,
full npm identifier in backticks, sorted alphabetically by package name. A
package whose block holds nothing but 🧱 Updated Dependencies still earns a line,
since consumers pin exact versions, but contributes nothing to Changes.

**Changes** is one de-duplicated list for the whole release, not a per-package
breakdown. Dedupe on the distinct change, which is not the same as deduping on
the PR number:

- The same change echoed under five packages appears once.
- The same change listed twice under one package — Nx emits both the `feat` and
  its follow-up `refactor` — collapses to one line.
- One PR carrying two unrelated changes stays as two lines, both linking it.

Summarise each as a short noun phrase ("Figma tokens sync", "Point label
clamping"), never the verbatim commit subject, and drop the `feat:` / `chore:`
prefixes. Order by ascending PR number; any stable rule would do, the point is
that two people formatting the same dump produce the same message. A change with
no PR in the source simply carries no link.

**Breaking changes** is always present, even when empty. Trust the commit
subject, never the version number: Lumen version plans are always `patch` (the
`release-plan` skill), so a breaking change ships as `0.1.52 → 0.1.53` exactly
like a typo fix. Waiting for a major bump misses every breaking change this repo
has actually shipped. Scan instead for:

- a `!` before the colon — `refactor!:`, `feat(Button)!:`
- a `BREAKING CHANGE:` / `BREAKING_CHANGE(Scope):` marker, or 💥
- an indented block under a bullet explaining what to migrate to
- an export described as removed, renamed, or made internal

Nothing found → `None.` Otherwise one bullet each, as
``- `{package}@{version}` — {what breaks} ([#{PR}](…))``, then a final
`Full changelog: https://github.com/LedgerHQ/lumen/releases` line. Say what a
consumer has to do — "`BaseInput` is now internal, use `TextInput`" beats
"`BaseInput` removed" — split per package when the details differ, and never
repeat a breaking entry under Changes.

## Reading the dump

Per package block, take the name, the version and date from the `## X.Y.Z (date)`
line, and each change bullet with its `#PR`. Drop the rest, including the
"❤️ Thank You" contributors block — no names in the announcement.

The Nx release bot files almost everything under `### 🩹 Fixes` regardless of
prefix, so `feat(...)` and `chore(...)` lines routinely sit under a "Fixes"
header. Read the subject, not the section it landed in.

Input also arrives hand-written: a title with a date, a few `* change` lines, and
a "Package version update:" list. Those feed **Changes** and **Packages updated**
respectively; the template is unchanged.

## Posting it

These announcements have a dedicated home: **#lumen-releases** (channel ID
`C0BCC3YKRLY`). That is the default target every time — don't ask which channel
unless the user raises it; if they name another, use theirs.

**Draft, don't send.** Use the Slack connector's draft tool against
`C0BCC3YKRLY` and hand back the draft link. A release announcement lands in front
of the whole team, so a human glance is the cheapest place to catch a wrong
version or a garbled line. Send directly only if the user explicitly asks to send
rather than draft.

If no Slack tool is available, say so plainly and output the message in a fenced
code block to copy by hand. Silently dropping the step leaves the user thinking
it went out.

## Worked examples

`references/worked-example.md` walks three real releases end to end: a
six-package dump with heavy cross-package overlap, a two-package shorthand, and
one that broke two packages while bumping as an ordinary patch. Read it once to
calibrate how far to compress a change.
