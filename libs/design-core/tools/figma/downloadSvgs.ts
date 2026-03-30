import * as fs from 'fs';
import * as path from 'path';
import { SvgData } from './getSvgs.js';

/**
 * This file is based on `figma-api-exporter`: https://github.com/slawomirkolodziej/figma-api-exporter/blob/master/src/downloadSvgs.ts
 */

type DownloadSvgsConfig = {
  svgsData: SvgData[];
  saveDirectory: string;
  clearDirectory?: boolean;
  lastModified: string;
  forceDownload?: boolean; // If true, will download svgs even if the last modified date is the same
};

type DownloadedSvgData = {
  data: string;
  name: string;
};

type ConfigFileData = {
  lastModified?: string;
  componentIds?: string[];
};

const createDir = (dir: string): Promise<void> => {
  return new Promise<void>((resolve) => {
    if (!fs.existsSync(dir)) {
      fs.mkdir(dir, null, () => resolve());
    } else {
      resolve();
    }
  });
};

const getDataFromConfig = async (
  configFilePath: string,
): Promise<ConfigFileData> => {
  return new Promise((resolve) => {
    fs.readFile(configFilePath, (err, data) => {
      if (err) {
        return resolve({});
      }
      const configData = JSON.parse(data.toString()) as ConfigFileData;
      return resolve(configData);
    });
  });
};

const downloadSvgsData = (svgsData: SvgData[]): Promise<DownloadedSvgData[]> =>
  Promise.all(
    svgsData.map(async (data): Promise<DownloadedSvgData> => {
      const downloadedSvg = await fetch(data.url).then((r) => r.text());

      return {
        data: downloadedSvg,
        name: data.name,
      };
    }),
  );

const saveSvgsToFiles = async (
  downloadedSvgsData: DownloadedSvgData[],
  saveDirectory: string,
): Promise<void> => {
  const names = downloadedSvgsData.map((svg) => svg.name);
  const duplicates = names.filter(
    (name, index) => names.indexOf(name) !== index,
  );

  if (duplicates.length > 0) {
    console.warn('⚠️ Duplicate icon names found:', duplicates);
  }

  await Promise.all(
    downloadedSvgsData.map((svgData, index) => {
      if (names.indexOf(svgData.name) !== index) {
        return Promise.resolve();
      }

      return new Promise((resolve) =>
        fs.writeFile(
          path.join(saveDirectory, `${svgData.name}.svg`),
          svgData.data,
          resolve,
        ),
      );
    }),
  );
};

const saveConfigFile = async (
  configFilePath: string,
  fileData: ConfigFileData,
): Promise<unknown> => {
  return new Promise((resolve) => {
    fs.writeFile(configFilePath, JSON.stringify(fileData), resolve);
  });
};

export const downloadSvgs = async (
  config: DownloadSvgsConfig,
): Promise<void> => {
  const DOWNLOAD_CONFIG_FILENAME = 'downloadData.json';
  const componentIds = config.svgsData.map((d) => d.id);

  const dataFromConfig = await getDataFromConfig(
    path.join(config.saveDirectory, DOWNLOAD_CONFIG_FILENAME),
  );

  const arraysEqual = (a1: string[], a2: string[]) =>
    a1.length === a2.length && a1.every((item) => a2.includes(item));
  const shouldDownloadSvgs =
    config.forceDownload ||
    config.lastModified !== dataFromConfig.lastModified ||
    !arraysEqual(componentIds, dataFromConfig.componentIds ?? []);

  if (!shouldDownloadSvgs) {
    return Promise.resolve();
  }

  if (config.clearDirectory) {
    await fs.rmSync(config.saveDirectory, { recursive: true, force: true });
  }

  await createDir(config.saveDirectory);

  const downloadedSvgsData = await downloadSvgsData(config.svgsData);

  await saveSvgsToFiles(downloadedSvgsData, config.saveDirectory);

  await saveConfigFile(
    path.join(config.saveDirectory, DOWNLOAD_CONFIG_FILENAME),
    { lastModified: config.lastModified, componentIds },
  );
};
