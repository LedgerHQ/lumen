import {
  GetLocalVariablesResponse,
  GetFileStylesResponse,
  GetFileNodesResponse,
  PostVariablesResponse,
  PostVariablesRequestBody,
  GetFileResponse,
  GetImagesResponse,
} from '@figma/rest-api-spec';
import { mapValues, omitBy } from 'lodash-es';

type CallFigmaAPIOptions = {
  apiPath: string;
  method?: string;
  token: string;
  body?: Record<string, unknown>;
  queryParams?: Record<
    string,
    string | number | boolean | undefined | string[]
  >;
};

async function callFigmaAPI<T>({
  apiPath,
  method = 'GET',
  token,
  body = undefined,
  queryParams = undefined,
}: CallFigmaAPIOptions): Promise<T> {
  const baseURL = 'https://api.figma.com';
  const queryString = queryParams
    ? `?${new URLSearchParams(
        mapValues(
          omitBy(queryParams, (value) => value === undefined),
          (value) => (Array.isArray(value) ? value.join(',') : String(value)),
        ),
      ).toString()}`
    : '';

  const response = await fetch(`${baseURL}/${apiPath}${queryString}`, {
    method,
    headers: {
      ...(method === 'POST'
        ? {
            'Content-Type': 'application/json',
          }
        : {
            Accept: '*/*',
          }),
      'X-Figma-Token': token,
    },
    ...(method === 'POST' && body && { body: JSON.stringify(body) }),
  });

  if (!response.ok) {
    throw new Error(
      `Error while calling ${method}: ${apiPath}: ${response.status} ${response.statusText}`,
    );
  }
  return (await response.json()) as T;
}

async function getLocalVariables(
  fileKey: string,
  figmaToken: string,
): Promise<GetLocalVariablesResponse> {
  return callFigmaAPI<GetLocalVariablesResponse>({
    apiPath: `v1/files/${fileKey}/variables/local`,
    token: figmaToken,
  });
}

async function getStylesMetadata(
  fileKey: string,
  figmaToken: string,
): Promise<GetFileStylesResponse> {
  return callFigmaAPI<GetFileStylesResponse>({
    apiPath: `v1/files/${fileKey}/styles`,
    token: figmaToken,
  });
}

async function getFileNodes(
  fileKey: string,
  figmaToken: string,
  nodes: string[],
): Promise<GetFileNodesResponse> {
  if (!nodes.length) {
    throw new Error('No nodes provided to fetch styles metadata.');
  }
  return callFigmaAPI<GetFileNodesResponse>({
    apiPath: `v1/files/${fileKey}/nodes?ids=${nodes.join(',')}`,
    token: figmaToken,
  });
}

async function getFile(
  fileKey: string,
  figmaToken: string,
): Promise<GetFileResponse> {
  return callFigmaAPI<GetFileResponse>({
    apiPath: `v1/files/${fileKey}`,
    token: figmaToken,
  });
}

async function getFileImages(
  fileKey: string,
  figmaToken: string,
  params?: {
    ids?: string[];
    scale?: number;
    format?: 'svg' | 'png' | 'jpg' | 'pdf';
    svg_outline_text?: boolean;
    svg_include_id?: boolean;
    svg_include_node_id?: boolean;
    svg_simplify_stroke?: boolean;
    contents_only?: boolean;
    use_absolute_bounds?: boolean;
    version?: number;
  },
): Promise<GetImagesResponse> {
  return callFigmaAPI<GetImagesResponse>({
    apiPath: `v1/images/${fileKey}`,
    token: figmaToken,
    queryParams: params,
  });
}

async function postVariables(
  fileKey: string,
  figmaToken: string,
  body: PostVariablesRequestBody,
): Promise<PostVariablesResponse> {
  return callFigmaAPI<PostVariablesResponse>({
    method: 'POST',
    apiPath: `v1/files/${fileKey}/variables`,
    token: figmaToken,
    body,
  });
}

export default {
  getLocalVariables,
  getStylesMetadata,
  getFileNodes,
  getFile,
  getFileImages,
  postVariables,
};
