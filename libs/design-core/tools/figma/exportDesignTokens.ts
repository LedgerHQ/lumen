/**
 * This file is based on gerard-figma's project: https://github.com/gerard-figma/figma-variables-to-styledictionary/
 * which is released under the MIT license.
 * Copyright 2013 gerard-figma
 */

import * as fs from 'fs';
import figmaApi from './api.js';
import getEnvironmentVariables from './getEnvironmentVariables.js';
import tokenFileNameRenamer from './tokenFileNameRenamer.js';
import tokenFilesFromLocalVariables from './tokenFilesFromLocalVariables.js';

const outputDir = 'tokens';

function writeFilesSync<T>(
  outputDir: string,
  filesDictionary: Record<string, T>,
) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  Object.entries(filesDictionary).forEach(([fileName, fileContent]) => {
    fs.writeFileSync(
      `${outputDir}/${fileName}`,
      JSON.stringify(fileContent, null, 2),
    );
  });
}

async function exportDesignTokens() {
  const { figmaToken, fileKey } = getEnvironmentVariables();
  const localVariables = await figmaApi.getLocalVariables(fileKey, figmaToken);

  const tokensFiles = tokenFilesFromLocalVariables(
    localVariables,
    tokenFileNameRenamer,
  );

  writeFilesSync(outputDir, tokensFiles);
}

async function main() {
  await exportDesignTokens();
}

main();
