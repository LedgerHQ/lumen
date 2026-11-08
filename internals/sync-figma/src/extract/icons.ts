import type { Node } from '@figma/rest-api-spec';
import type { FigmaClient } from '../client/figmaClient.js';

export type IconComponent = { id: string; name: string };

export type ExtractedIcons = {
  /** File name (`<name>.svg`) → SVG markup. */
  svgs: Record<string, string>;
  components: IconComponent[];
  lastModified: string;
};

const BATCH_SIZE = 100;
/** Parallel SVG downloads: enough to be fast, few enough not to drop sockets. */
const DOWNLOAD_CONCURRENCY = 10;

/** Runs `task` over `items`, `limit` at a time, keeping the results in order. */
const mapWithLimit = async <Item, Result>(
  items: Item[],
  limit: number,
  task: (item: Item) => Promise<Result>,
): Promise<Result[]> => {
  const results: Result[] = new Array(items.length);
  let next = 0;
  const worker = async (): Promise<void> => {
    while (next < items.length) {
      const index = next++;
      results[index] = await task(items[index]);
    }
  };
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, worker),
  );
  return results;
};

/** Every component on the icons canvas, in document order. */
export const findIconComponents = (
  document: Node,
  canvasName: string,
): IconComponent[] => {
  const components: IconComponent[] = [];
  const frontier: Node[] = [document];

  while (frontier.length) {
    const node = frontier.pop() as Node;
    if (node.type === 'CANVAS' && node.name !== canvasName) continue;
    if ('children' in node) frontier.push(...(node.children ?? []));
    if (node.type === 'COMPONENT') {
      components.push({ id: node.id, name: node.name });
    }
  }
  return components;
};

/**
 * Renders every icon component on the canvas to SVG. Two components with the
 * same name keep the first one, as the export always did, with a warning.
 */
export const extractIcons = async (
  client: FigmaClient,
  { fileKey, canvas }: { fileKey: string; canvas: string },
): Promise<ExtractedIcons> => {
  const file = await client.getFile(fileKey);
  const components = findIconComponents(file.document, canvas);

  const urls: Record<string, string | null> = {};
  for (let index = 0; index < components.length; index += BATCH_SIZE) {
    const batch = components.slice(index, index + BATCH_SIZE);
    const { images } = await client.getSvgUrls(
      fileKey,
      batch.map(({ id }) => id),
    );
    Object.assign(urls, images);
  }

  const svgs: Record<string, string> = {};
  const duplicates: string[] = [];
  const markups = await mapWithLimit(
    components,
    DOWNLOAD_CONCURRENCY,
    async ({ id }) => {
      const url = urls[id];
      if (!url) throw new Error(`Figma rendered no SVG for icon ${id}`);
      return client.download(url);
    },
  );
  components.forEach(({ name }, index) => {
    const fileName = `${name}.svg`;
    if (fileName in svgs) {
      duplicates.push(name);
      return;
    }
    svgs[fileName] = markups[index];
  });
  if (duplicates.length) {
    console.warn('⚠️ Duplicate icon names found:', duplicates);
  }

  return { svgs, components, lastModified: file.lastModified };
};
