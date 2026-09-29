import { execFileSync } from 'node:child_process';

let cachedToken: string | undefined;

/**
 * Prefers GITHUB_TOKEN/GH_TOKEN (CI) and falls back to the local `gh` CLI's
 * own auth (matches how this was verified interactively — `gh auth token`
 * reads the same credential `gh api`/`gh search` already use).
 */
function getGithubToken(): string {
  if (cachedToken) return cachedToken;

  const envToken = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;
  if (envToken) {
    cachedToken = envToken;
    return cachedToken;
  }

  try {
    cachedToken = execFileSync('gh', ['auth', 'token'], {
      encoding: 'utf-8',
    }).trim();
    return cachedToken;
  } catch {
    throw new Error(
      'No GitHub token available: set GITHUB_TOKEN/GH_TOKEN, or run `gh auth login`.',
    );
  }
}

function githubHeaders(): Record<string, string> {
  return {
    Authorization: `Bearer ${getGithubToken()}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

/**
 * Fetches a repo file's content via the GitHub Contents API and returns its
 * decoded text, or `undefined` if the file doesn't exist (404) — callers
 * treat a missing file as "not applicable" rather than a hard failure, since
 * not every consumer repo uses a pnpm catalog.
 */
export async function getRepoFileContent(
  repo: string,
  path: string,
): Promise<string | undefined> {
  const response = await fetch(
    `https://api.github.com/repos/${repo}/contents/${path}`,
    { headers: githubHeaders() },
  );

  if (response.status === 404) return undefined;
  if (!response.ok) {
    throw new Error(
      `GitHub contents ${repo}/${path}: ${response.status} ${response.statusText}`,
    );
  }

  const data = (await response.json()) as { content: string; encoding: string };
  return Buffer.from(data.content, data.encoding as BufferEncoding).toString(
    'utf-8',
  );
}

/**
 * Lists every file path in a repo's default branch with one Git Trees call —
 * far cheaper than walking directories through the Contents API.
 */
export async function listRepoFiles(repo: string): Promise<string[]> {
  const response = await fetch(
    `https://api.github.com/repos/${repo}/git/trees/HEAD?recursive=1`,
    { headers: githubHeaders() },
  );

  if (!response.ok) {
    throw new Error(
      `GitHub tree ${repo}: ${response.status} ${response.statusText}`,
    );
  }

  const data = (await response.json()) as {
    tree: { path: string; type: string }[];
    truncated: boolean;
  };
  if (data.truncated) {
    throw new Error(`GitHub tree ${repo} is truncated; can't list all files.`);
  }
  return data.tree
    .filter((node) => node.type === 'blob')
    .map((node) => node.path);
}

export type CodeSearchHit = { repo: string; path: string };

/**
 * Best-effort discovery via GitHub code search — only indexes default
 * branches and isn't guaranteed exhaustive or stable run-to-run, so this is
 * for `discover.ts` (a human-reviewed diff), never for `report.ts` (which
 * reads the git-tracked `data/consumers.json` registry instead).
 */
export async function searchPackageJsonUsage(
  org: string,
  packageName: string,
): Promise<CodeSearchHit[]> {
  const query = encodeURIComponent(
    `org:${org} "${packageName}" filename:package.json`,
  );
  const response = await fetch(
    `https://api.github.com/search/code?q=${query}&per_page=100`,
    { headers: githubHeaders() },
  );

  if (!response.ok) {
    throw new Error(
      `GitHub code search for ${packageName}: ${response.status} ${response.statusText}`,
    );
  }

  const data = (await response.json()) as {
    items: { path: string; repository: { full_name: string } }[];
  };
  return data.items.map((item) => ({
    repo: item.repository.full_name,
    path: item.path,
  }));
}
