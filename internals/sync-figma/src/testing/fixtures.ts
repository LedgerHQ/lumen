import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { GetLocalVariablesResponse } from '@figma/rest-api-spec';

/**
 * Recorded Figma API responses. Tests never call the network: they read these,
 * and get a fresh copy each time so a test can mutate it.
 */
export const loadFixture = <T = GetLocalVariablesResponse>(
  fileName: string,
): T =>
  JSON.parse(
    readFileSync(path.join(import.meta.dirname, 'fixtures', fileName), 'utf8'),
  ) as T;
