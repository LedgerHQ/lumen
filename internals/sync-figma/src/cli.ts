import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { createFigmaClient } from './client/figmaClient.js';
import { automationConfig } from './config.js';
import { extractIcons } from './extract/icons.js';
import { extractTokenFiles } from './extract/tokens.js';
import { parseCliArgs } from './shared/parseCliArgs.js';
import { toJsonFile, writeSourceFiles } from './shared/writeSourceFiles.js';
import { uploadCodeSyntax } from './write-back/codeSyntax.js';

/**
 * `extract --kind=tokens|icons` and `code-syntax`: the only entry points that
 * reach Figma. Each reads its own environment variables, so a workflow passes
 * only the secrets its kind needs.
 */

const requireEnv = <const Names extends readonly string[]>(
  ...names: Names
): Record<Names[number], string> => {
  const missing = names.filter((name) => !process.env[name]);
  if (missing.length) {
    throw new Error(`Set the ${missing.join(', ')} environment variables.`);
  }
  return Object.fromEntries(
    names.map((name) => [name, process.env[name] as string]),
  ) as Record<Names[number], string>;
};

const logResult = (
  kind: string,
  { written, deleted }: { written: string[]; deleted: string[] },
): void => {
  console.log(`✅ ${kind}: wrote ${written.length} files`);
  deleted.forEach((name) => console.log(`🧹 ${kind}: deleted stale ${name}`));
};

const extractTokens = async (): Promise<void> => {
  const env = requireEnv('FIGMA_API_TOKEN', 'FIGMA_FOUNDATIONS_FILE_KEY');
  const client = createFigmaClient({ token: env.FIGMA_API_TOKEN });
  const response = await client.getLocalVariables(
    env.FIGMA_FOUNDATIONS_FILE_KEY,
  );
  const files = extractTokenFiles(response);

  logResult(
    'tokens',
    writeSourceFiles(
      automationConfig.figmaTokensPath,
      Object.fromEntries(
        Object.entries(files).map(([name, tokens]) => [
          name,
          toJsonFile(tokens),
        ]),
      ),
      { extension: '.tokens.json' },
    ),
  );
};

const extractIconFiles = async (): Promise<void> => {
  const env = requireEnv(
    'FIGMA_API_TOKEN',
    'FIGMA_SYMBOLS_FILE_KEY',
    'FIGMA_ICONS_CANVAS',
  );
  const client = createFigmaClient({ token: env.FIGMA_API_TOKEN });
  const icons = await extractIcons(client, {
    fileKey: env.FIGMA_SYMBOLS_FILE_KEY,
    canvas: env.FIGMA_ICONS_CANVAS,
  });

  logResult(
    'icons',
    writeSourceFiles(automationConfig.iconsPath, icons.svgs, {
      extension: '.svg',
    }),
  );
  writeFileSync(
    path.join(automationConfig.iconsPath, 'icons.json'),
    toJsonFile({
      lastModified: icons.lastModified,
      componentIds: icons.components.map(({ id }) => id),
    }),
  );
};

const codeSyntax = async (): Promise<void> => {
  const env = requireEnv('FIGMA_API_TOKEN', 'FIGMA_FOUNDATIONS_FILE_KEY');
  const client = createFigmaClient({ token: env.FIGMA_API_TOKEN });
  await uploadCodeSyntax(client, env.FIGMA_FOUNDATIONS_FILE_KEY);
};

const [command, ...rest] = process.argv.slice(2);
const args = parseCliArgs(rest);

const commands: Record<string, () => Promise<void>> = {
  'extract:tokens': extractTokens,
  'extract:icons': extractIconFiles,
  'code-syntax': codeSyntax,
};
const run = commands[command === 'extract' ? `extract:${args.kind}` : command];

if (!run) {
  console.error(
    'Usage: cli.ts extract --kind=tokens|icons | cli.ts code-syntax',
  );
  process.exit(1);
}

try {
  await run();
} catch (error) {
  console.error(error);
  process.exit(1);
}
