import { promises as fs } from 'fs';
import * as os from 'os';
import path from 'path';
import { toPascalCase } from '@ledgerhq/lumen-utils-shared';
import { transform } from '@svgr/core';
import { automationConfig } from '../config.js';
import { findFilesByExtension } from '../tools/utils/fsUtils.js';
import { parseCliArgs } from '../tools/utils/parseCliArgs.js';

const params = parseCliArgs(process.argv.slice(2));

if (!params.outputPath) {
  console.error('❌ Error: --outputPath parameter is required');
  process.exit(1);
}

if (!params.templatePath) {
  console.error('❌ Error: --templatePath parameter is required');
  process.exit(1);
}

const CWD = process.cwd();
const INPUT_DIR = path.join(CWD, automationConfig.symbolsInputPath);
const OUTPUT_DIR = path.resolve(CWD, params.outputPath);
const BARREL_FILE = path.join(OUTPUT_DIR, 'index.ts');
const isReactNative = params.isReactNative === 'true';
const ignoredFiles: string[] = [];

let iconTemplate: any;

if (params.templatePath) {
  const templatePath = path.resolve(CWD, params.templatePath);
  try {
    const templateModule = await import(templatePath);
    iconTemplate = templateModule.default || templateModule;
  } catch (error) {
    console.error(`❌ Error importing template from ${templatePath}:`, error);
    process.exit(1);
  }
}

const svgrConfig = {
  template: iconTemplate,
  typescript: true,
  replaceAttrValues: {
    '#000': 'currentColor',
    '#000000': 'currentColor',
    black: 'currentColor',
  },
  svgProps: {
    fill: 'currentColor',
  },
  icon: true,
  jsxRuntime: 'automatic' as const,
  expandProps: false,
  plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
  native: isReactNative,
  svgoConfig: {
    plugins: [
      {
        name: 'preset-default' as const,
        params: {
          overrides: {
            cleanupIds: false as const,
            removeViewBox: false as const,
          },
        },
      },
      ...(isReactNative ? ['removeXMLNS' as const] : []),
    ],
  },
};
async function generateSymbols() {
  console.log('🔥 Starting symbol generation...');

  const svgFiles = await findFilesByExtension(INPUT_DIR, '.svg');

  const ignoredSvgFiles = svgFiles.filter((file) =>
    ignoredFiles.includes(path.basename(file)),
  );

  const preservedPaths = new Set<string>();

  for (const ignoredSvg of ignoredSvgFiles) {
    const relativeSvgPath = path.relative(INPUT_DIR, ignoredSvg);
    const relativeDir = path.dirname(relativeSvgPath);
    const symbolDir = relativeDir;
    const baseName = path.basename(ignoredSvg, '.svg');
    const componentName = toPascalCase(baseName);
    const outputFilePath = path.join(
      OUTPUT_DIR,
      symbolDir,
      `${componentName}.tsx`,
    );
    preservedPaths.add(outputFilePath);
  }

  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'tmp-icons-'));

  for (const preservedPath of preservedPaths) {
    try {
      await fs.access(preservedPath);
      const relative = path.relative(OUTPUT_DIR, preservedPath);
      const tempPath = path.join(tempDir, relative);
      await fs.mkdir(path.dirname(tempPath), { recursive: true });
      await fs.copyFile(preservedPath, tempPath);
    } catch {
      // skip if not exists
    }
  }

  // Only clean the generated symbol subdirectories (e.g. `icons/`), not the
  // whole OUTPUT_DIR, so hand-maintained files living alongside them (such as
  // `symbols/utils/icon-template.ts`) survive a regeneration.
  const generatedDirs = new Set(
    svgFiles.map((file) => path.dirname(path.relative(INPUT_DIR, file))),
  );
  for (const dir of generatedDirs) {
    await fs.rm(path.join(OUTPUT_DIR, dir), { recursive: true, force: true });
  }
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.cp(tempDir, OUTPUT_DIR, { recursive: true });
  await fs.rm(tempDir, { recursive: true, force: true });

  console.log(
    '🧹 Cleaned generated symbol directories, preserving manual files for ignored SVGs.',
  );

  if (svgFiles.length === 0) {
    console.warn('⚠️ No SVG files found. Exiting.');
    await fs.writeFile(BARREL_FILE, '\n');
    return;
  }

  console.log(`🔎 Found ${svgFiles.length} SVG files to process.`);

  const filteredSvgFiles = svgFiles.filter(
    (file) => !ignoredFiles.includes(path.basename(file)),
  );

  if (filteredSvgFiles.length !== svgFiles.length) {
    console.warn(
      `⚠️ ${svgFiles.length - filteredSvgFiles.length} SVG files were ignored.`,
    );
  }

  const exportPaths: { barrelExportPath: string; componentName: string }[] = [];

  for (const svgFile of filteredSvgFiles) {
    const relativeSvgPath = path.relative(INPUT_DIR, svgFile);
    const relativeDir = path.dirname(relativeSvgPath);
    const symbolDir = relativeDir;
    const finalOutputDir = path.join(OUTPUT_DIR, symbolDir);

    const baseName = path.basename(svgFile, '.svg');
    const componentName = toPascalCase(baseName);

    try {
      const svgCode = await fs.readFile(svgFile, 'utf-8');
      const componentCode = await transform(svgCode, svgrConfig, {
        componentName,
      });

      await fs.mkdir(finalOutputDir, { recursive: true });

      const outputFilePath = path.join(finalOutputDir, `${componentName}.tsx`);
      await fs.writeFile(outputFilePath, componentCode);

      const barrelExportPath = path
        .join(symbolDir, componentName)
        .replace(/\\/g, '/');

      exportPaths.push({ barrelExportPath, componentName });
    } catch (error) {
      console.error(`❌ Failed to process ${svgFile}:`, error);
    }
  }
  console.log(`✅ Processed ${filteredSvgFiles.length} icons.`);

  for (const ignoredSvg of ignoredSvgFiles) {
    const relativeSvgPath = path.relative(INPUT_DIR, ignoredSvg);
    const relativeDir = path.dirname(relativeSvgPath);
    const symbolDir = relativeDir;
    const baseName = path.basename(ignoredSvg, '.svg');
    const componentName = toPascalCase(baseName);
    const outputFilePath = path.join(
      OUTPUT_DIR,
      symbolDir,
      `${componentName}.tsx`,
    );
    try {
      await fs.access(outputFilePath);
      const barrelExportPath = path
        .join(symbolDir, componentName)
        .replace(/\\/g, '/');
      exportPaths.push({ barrelExportPath, componentName });
    } catch {
      // skip
    }
  }

  const sortedExportPaths = exportPaths.sort((a, b) =>
    a.componentName.localeCompare(b.componentName),
  );

  const barrelCode = sortedExportPaths
    .map(
      ({ componentName, barrelExportPath }) =>
        `export { ${componentName} } from './${barrelExportPath}';`,
    )
    .join('\n');

  await fs.writeFile(BARREL_FILE, barrelCode + '\n');
  console.log('📦 Created barrel file.');
  console.log('🎉 Symbol generation complete!');
}

try {
  await generateSymbols();
} catch (error) {
  console.error('An unexpected error occurred:', error);
  process.exit(1);
}
