import * as fs from 'fs/promises';
import { URL } from 'node:url';
import path from 'path';
import { GetLocalVariablesResponse } from '@figma/rest-api-spec';
const __dirname = new URL('.', import.meta.url).pathname;

async function getMocksFromFileSystem(
  fileName: string,
): Promise<GetLocalVariablesResponse> {
  const filePath = path.resolve(__dirname, 'fixtures/', fileName);

  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const parsedResponse = JSON.parse(fileContent) as GetLocalVariablesResponse;
    return Promise.resolve(parsedResponse);
  } catch (error) {
    return Promise.reject(error);
  }
}

export default {
  getMocksFromFileSystem,
};
