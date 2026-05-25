# Pull Requests

## Dev Package Publishing

Publish dev packages from a PR so reviewers can install them with a single `npm install <url>`. Tarballs live on a per-PR GitHub pre-release and are deleted when the PR closes.

### How it works

1. Add the `publish-dev-package` label to your PR.
2. CI builds the affected libraries, runs `npm pack`, and uploads each `.tgz` to a pre-release tagged `dev-pr-<PR_NUMBER>`.
3. A sticky **📦 Dev packages published** comment lists the install command for every affected package.
4. Each new commit refreshes the release and the comment. Closing the PR (merged or not) deletes both the release and its git tag.

Remove the label to stop publishing on subsequent commits.

### Version format

Each tarball is stamped with a prerelease suffix:

```
<current-version>-pr.<PR_NUMBER>.<SHORT_SHA>
```

Every commit gets a unique URL; the PR number stays constant so all builds from one PR are identifiable.

### How to consume

Copy the install command from the PR comment, e.g.:

```bash
npm install https://github.com/LedgerHQ/lumen/releases/download/dev-pr-<PR_NUMBER>/ledgerhq-lumen-ui-react-0.1.33-pr.<PR_NUMBER>.<SHORT_SHA>.tgz
```

The same URL also works as a `package.json` dependency value — `npm` accepts tarball URLs as version specifiers. Install URLs are **immutable per commit**, so always copy the latest one from the PR comment.
