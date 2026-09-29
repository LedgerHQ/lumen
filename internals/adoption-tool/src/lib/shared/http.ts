import * as log from './logging.js';

export type FetchRetryOptions = {
  timeoutMs?: number;
  maxAttempts?: number;
  fetchImpl?: typeof fetch;
  sleep?: (ms: number) => Promise<void>;
  now?: () => number;
};

const DEFAULT_TIMEOUT_MS = 30_000;
const DEFAULT_MAX_ATTEMPTS = 4;
const BASE_BACKOFF_MS = 1_000;
// Past this the limit won't lift soon (e.g. an hourly quota): hand the failing
// response back so the caller fails fast with a useful message instead of hanging.
const MAX_WAIT_MS = 120_000;

function backoffMs(attempt: number): number {
  return BASE_BACKOFF_MS * 2 ** (attempt - 1);
}

function rateLimitWaitMs(
  response: Response,
  nowMs: number,
): number | undefined {
  const retryAfter = Number(response.headers.get('retry-after'));
  if (retryAfter > 0) return retryAfter * 1000;

  const reset = Number(response.headers.get('x-ratelimit-reset'));
  if (response.headers.get('x-ratelimit-remaining') === '0' && reset > 0) {
    return Math.max(0, reset * 1000 - nowMs) + 1_000;
  }
  return undefined;
}

/**
 * How long to wait before retrying a response, or `undefined` if it should be
 * returned as-is. Retries 5xx, 429, and 403s that are really rate limits
 * (GitHub answers both primary and secondary limits with 403); a plain 403 is
 * a permission problem and never retried.
 */
export function retryDelayMs(
  response: Response,
  attempt: number,
  nowMs: number,
): number | undefined {
  const isRateLimited =
    response.status === 429 ||
    (response.status === 403 &&
      (response.headers.has('retry-after') ||
        response.headers.get('x-ratelimit-remaining') === '0'));

  let delay: number | undefined;
  if (isRateLimited)
    delay = rateLimitWaitMs(response, nowMs) ?? backoffMs(attempt);
  else if (response.status >= 500) delay = backoffMs(attempt);

  return delay !== undefined && delay <= MAX_WAIT_MS ? delay : undefined;
}

function errorText(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * `fetch` with a per-attempt timeout and retries for transient failures
 * (network errors, timeouts, 5xx, rate limits). Non-retryable statuses — and
 * the last attempt's response — are returned untouched so callers keep
 * deciding what a 404 or 401 means.
 */
export async function fetchWithRetry(
  url: string,
  init: RequestInit = {},
  options: FetchRetryOptions = {},
): Promise<Response> {
  const {
    timeoutMs = DEFAULT_TIMEOUT_MS,
    maxAttempts = DEFAULT_MAX_ATTEMPTS,
    fetchImpl = fetch,
    sleep = (ms: number): Promise<void> =>
      new Promise((resolve) => setTimeout(resolve, ms)),
    now = Date.now,
  } = options;

  for (let attempt = 1; ; attempt += 1) {
    let response: Response;
    try {
      response = await fetchImpl(url, {
        ...init,
        signal: AbortSignal.timeout(timeoutMs),
      });
    } catch (error) {
      if (attempt >= maxAttempts) {
        throw new Error(
          `${url}: ${errorText(error)} (after ${attempt} attempts)`,
        );
      }
      const delay = backoffMs(attempt);
      log.warn(`${url}: ${errorText(error)} — retrying in ${delay / 1000}s`);
      await sleep(delay);
      continue;
    }

    const delay =
      attempt < maxAttempts
        ? retryDelayMs(response, attempt, now())
        : undefined;
    if (delay === undefined) return response;

    log.warn(
      `${url}: HTTP ${response.status} — retrying in ${Math.ceil(delay / 1000)}s`,
    );
    await response.body?.cancel();
    await sleep(delay);
  }
}
