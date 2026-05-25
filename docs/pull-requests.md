# Pull Requests

## Dev Package Publishing

Publish dev packages from a PR to test bug fixes or new features without releasing to production. Tarballs are hosted as assets on a per-PR GitHub pre-release, so any reviewer can install them with a single `npm install <url>` command.

### How it works

1. Add the `publish-dev-package` label to your PR
2. The CI builds the affected libraries and runs `npm pack` on each one
3. The resulting `.tgz` tarballs are uploaded as assets on a per-PR GitHub pre-release tagged `dev-pr-<PR_NUMBER>`
4. A sticky comment on the PR shows the exact install commands for every affected package
5. Each new commit pushed to the PR replaces the release with fresh tarballs and updates the comment
6. Remove the label to stop publishing on subsequent commits
7. When the PR is closed (merged or not), the pre-release and its git tag are deleted automatically

### Version format

Each tarball is stamped with a prerelease suffix based on the PR number and commit hash:

```
<current-version>-pr.<PR_NUMBER>.<SHORT_SHA>
```

For example, if `@ledgerhq/lumen-ui-react` is at version `0.1.33` and the PR number is `42`:

```
0.1.33-pr.42.a1b2c3d
```

Each commit produces a unique version. The PR number stays constant so consumers can identify all versions from a given PR.

### How to consume

1. Open the PR on GitHub and look for the **📦 Dev packages published** comment
2. Copy the install command from the comment table, for example:

```bash
npm install https://github.com/LedgerHQ/ldls/releases/download/dev-pr-42/ledgerhq-lumen-ui-react-0.1.33-pr.42.a1b2c3d.tgz
```

`npm` accepts a tarball URL anywhere it accepts a version specifier, so you can also add it directly to a consumer's `package.json`:

```json
{
  "dependencies": {
    "@ledgerhq/lumen-ui-react": "https://github.com/LedgerHQ/ldls/releases/download/dev-pr-42/ledgerhq-lumen-ui-react-0.1.33-pr.42.a1b2c3d.tgz"
  }
}
```

The install URL is **immutable per commit** — pushing a new commit creates a new URL. Always copy the latest one from the PR comment to make sure you're installing the most recent build.

### Important notes

- Dev packages are for **testing only**, not for production use
- Tarballs are hosted on GitHub Releases (no JFrog or external registry needed) and inherit the visibility of this repository
- Only affected libraries (those with changes in the PR) are packed and published
- The release is marked as a **pre-release** so it never shows up as "Latest" and does not appear in the main releases list view
- Both the release and its git tag are wiped when the PR is closed, leaving no trace in the repo's history
