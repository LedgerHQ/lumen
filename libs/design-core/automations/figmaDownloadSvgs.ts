import { mkdirSync } from 'fs';
import { dirname } from 'path';
import { config } from 'dotenv';
import { downloadSvgs } from '../tools/figma/downloadSvgs.js';
import { getSvgs } from '../tools/figma/getSvgs.js';
import { automationConfig } from './automation.config.js';

config({ path: '../../../../.env' });

const fileKey = process.env.FIGMA_SYMBOLS_FILE_KEY;
const iconsCanvas = process.env.FIGMA_ICONS_CANVAS;

if (!fileKey || !iconsCanvas) {
  throw new Error(
    `Please set the FIGMA_SYMBOLS_FILE_KEY and FIGMA_ICONS_CANVAS environment variables.`,
  );
}

const figmaDownloadSvgs = async () => {
  const svgsData = await getSvgs({
    fileId: fileKey,
    canvas: iconsCanvas,
  });

  console.log(`🔎 Found ${svgsData.svgs.length} icons`);

  const saveDirectory = automationConfig.symbolsOutputPath;
  mkdirSync(dirname(saveDirectory), { recursive: true });

  await downloadSvgs({
    saveDirectory,
    svgsData: svgsData.svgs,
    lastModified: svgsData.lastModified,
    forceDownload: true,
    clearDirectory: true,
  });

  console.log('✅ Downloaded icons');
};

try {
  await figmaDownloadSvgs();
} catch (error) {
  console.error(error);
}
