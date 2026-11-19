import type {
  GetFileResponse,
  GetImagesResponse,
  GetLocalVariablesResponse,
  PostVariablesRequestBody,
  PostVariablesResponse,
} from '@figma/rest-api-spec';

const FIGMA_API = 'https://api.figma.com';

type QueryValue = string | number | boolean | string[] | undefined;

export type FigmaClientOptions = {
  token: string;
  /** Injected in tests; defaults to the global `fetch`. */
  fetch?: typeof fetch;
  maxRetries?: number;
  /** Injected in tests so retries don't wait. */
  sleep?: (ms: number) => Promise<void>;
};

export type FigmaClient = {
  getLocalVariables(fileKey: string): Promise<GetLocalVariablesResponse>;
  getFile(fileKey: string): Promise<GetFileResponse>;
  getSvgUrls(fileKey: string, ids: string[]): Promise<GetImagesResponse>;
  postVariables(
    fileKey: string,
    body: PostVariablesRequestBody,
  ): Promise<PostVariablesResponse>;
  /** Downloads a rendered asset (the S3 URLs `getSvgUrls` returns). */
  download(url: string): Promise<string>;
};

const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);

const defaultSleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const toQueryString = (query?: Record<string, QueryValue>): string => {
  if (!query) return '';
  const entries = Object.entries(query)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => [
      key,
      Array.isArray(value) ? value.join(',') : String(value),
    ]);
  return entries.length ? `?${new URLSearchParams(entries).toString()}` : '';
};

/**
 * The only code that talks to Figma. Retries rate limits, transient HTTP
 * errors and network failures, honoring `Retry-After`, because a full icon
 * export makes hundreds of calls.
 */
export const createFigmaClient = ({
  token,
  fetch: fetchImpl = fetch,
  maxRetries = 4,
  sleep = defaultSleep,
}: FigmaClientOptions): FigmaClient => {
  const send = async (url: string, init: RequestInit): Promise<Response> => {
    for (let attempt = 0; ; attempt++) {
      let response: Response;
      try {
        response = await fetchImpl(url, init);
      } catch (error) {
        // A dropped connection is as transient as a 503.
        if (attempt >= maxRetries) throw error;
        await sleep(2 ** attempt * 1000);
        continue;
      }
      if (response.ok || !RETRYABLE_STATUS.has(response.status)) {
        return response;
      }
      if (attempt >= maxRetries) return response;

      const retryAfter = Number(response.headers.get('retry-after'));
      const delay =
        Number.isFinite(retryAfter) && retryAfter > 0
          ? retryAfter * 1000
          : 2 ** attempt * 1000;
      await sleep(delay);
    }
  };

  const call = async <T>(
    path: string,
    {
      method = 'GET',
      query,
      body,
    }: {
      method?: string;
      query?: Record<string, QueryValue>;
      body?: unknown;
    } = {},
  ): Promise<T> => {
    const response = await send(`${FIGMA_API}/${path}${toQueryString(query)}`, {
      method,
      headers: {
        'X-Figma-Token': token,
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    if (!response.ok) {
      throw new Error(
        `Figma ${method} ${path} failed: ${response.status} ${response.statusText}`,
      );
    }
    return (await response.json()) as T;
  };

  return {
    getLocalVariables: (fileKey) => call(`v1/files/${fileKey}/variables/local`),
    getFile: (fileKey) => call(`v1/files/${fileKey}`),
    getSvgUrls: (fileKey, ids) =>
      call(`v1/images/${fileKey}`, { query: { ids, format: 'svg' } }),
    postVariables: (fileKey, body) =>
      call(`v1/files/${fileKey}/variables`, { method: 'POST', body }),
    download: async (url) => {
      const response = await send(url, { method: 'GET' });
      if (!response.ok) {
        throw new Error(`Download failed: ${response.status} ${url}`);
      }
      return response.text();
    },
  };
};
