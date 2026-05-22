# Pull Requests

## Sandbox Package Publishing

Publish dev packages from a PR to test bug fixes or new features without releasing to production.

### How it works

1. Add the `publish-dev-package` label to your PR
2. The CI builds the affected libraries and publishes them to the JFrog sandbox registry
3. Each new commit pushed to the PR re-publishes with an updated version
4. A sticky comment on the PR shows the exact install commands
5. Remove the label to stop publishing on subsequent commits

### Version format

Published packages use a prerelease suffix based on the PR number and commit hash:

```
<current-version>-pr.<PR_NUMBER>.<SHORT_SHA>
```

For example, if `@ledgerhq/lumen-ui-react` is at version `0.1.33` and the PR number is `42`:

```
0.1.33-pr.42.a1b2c3d
```

Each commit produces a unique version. The PR number stays constant so consumers can identify all versions from a given PR.

### How to consume

1. Open the PR on GitHub and look for the **Sandbox packages published** comment
2. Copy the install command from the comment table, for example:

```bash
npm install @ledgerhq/lumen-ui-react@0.1.33-pr.42.a1b2c3d \
  --registry=https://jfrog.ledgerlabs.net/artifactory/api/npm/lumen-npm-sandbox-green/
```

You can also use the npm dist-tag `pr-<PR_NUMBER>` to always get the latest version from a PR:

```bash
npm install @ledgerhq/lumen-ui-react@pr-42 \
  --registry=https://jfrog.ledgerlabs.net/artifactory/api/npm/lumen-npm-sandbox-green/
```

### Important notes

- Sandbox packages are for **testing only**, not for production use
- Packages are published to the `lumen-npm-sandbox-green` registry, **not** the prod registry
- Only affected libraries (those with changes in the PR) are published
- The workflow requires Ledger internal CI runners and JFrog OIDC authentication
