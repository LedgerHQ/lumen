import { execFileSync } from 'node:child_process';
import { fetchWithRetry } from './http.js';

const GITHUB_API = 'https://api.github.com';
const JSON_MEDIA_TYPE = 'application/vnd.github+json';
// Serves file contents as plain text: no base64 round-trip, and no 1 MB cap.
const RAW_MEDIA_TYPE = 'application/vnd.github.raw+json';

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

function githubFetch(
  path: string,
  accept: string = JSON_MEDIA_TYPE,
): Promise<Response> {
  return fetchWithRetry(`${GITHUB_API}${path}`, {
    headers: {
      Authorization: `Bearer ${getGithubToken()}`,
      Accept: accept,
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
}

async function githubError(what: string, response: Response): Promise<Error> {
  const body = await response.text().catch(() => '');
  const detail = body ? ` — ${body.slice(0, 200)}` : '';
  return new Error(
    `GitHub ${what}: ${response.status} ${response.statusText}${detail}`,
  );
}

function encodePath(path: string): string {
  return path.split('/').map(encodeURIComponent).join('/');
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
  const response = await githubFetch(
    `/repos/${repo}/contents/${encodePath(path)}`,
    RAW_MEDIA_TYPE,
  );

  if (response.status === 404) return undefined;
  if (!response.ok)
    throw await githubError(`contents ${repo}/${path}`, response);
  return response.text();
}

/**
 * Lists every file path in a repo's default branch with one Git Trees call —
 * far cheaper than walking directories through the Contents API.
 */
export async function listRepoFiles(repo: string): Promise<string[]> {
  const response = await githubFetch(
    `/repos/${repo}/git/trees/HEAD?recursive=1`,
  );
  if (!response.ok) throw await githubError(`tree ${repo}`, response);

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
  const perPage = 100;
  const hits: CodeSearchHit[] = [];

  // Search results are capped at 1000, but a single page (100) is easily
  // exceeded by a monorepo with one package.json per workspace package.
  for (let page = 1; page <= 10; page += 1) {
    const response = await githubFetch(
      `/search/code?q=${query}&per_page=${perPage}&page=${page}`,
    );
    if (!response.ok) {
      throw await githubError(`code search for ${packageName}`, response);
    }

    const data = (await response.json()) as {
      total_count: number;
      items: { path: string; repository: { full_name: string } }[];
    };
    hits.push(
      ...data.items.map((item) => ({
        repo: item.repository.full_name,
        path: item.path,
      })),
    );
    if (data.items.length < perPage || hits.length >= data.total_count) break;
  }
  return hits;
}
