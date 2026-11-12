import type { GetFileResponse } from '@figma/rest-api-spec';
import { describe, expect, it, vi } from 'vitest';
import type { FigmaClient } from '../client/figmaClient.js';
import { extractIcons, findIconComponents } from './icons.js';

const document = {
  id: '0:0',
  name: 'Document',
  type: 'DOCUMENT',
  children: [
    {
      id: '1:0',
      name: 'Icons',
      type: 'CANVAS',
      children: [
        { id: '1:1', name: 'arrow-up', type: 'COMPONENT', children: [] },
        {
          id: '1:2',
          name: 'Group',
          type: 'FRAME',
          children: [
            { id: '1:3', name: 'check', type: 'COMPONENT', children: [] },
            { id: '1:4', name: 'arrow-up', type: 'COMPONENT', children: [] },
          ],
        },
      ],
    },
    {
      id: '2:0',
      name: 'Drafts',
      type: 'CANVAS',
      children: [{ id: '2:1', name: 'draft', type: 'COMPONENT', children: [] }],
    },
  ],
} as unknown as GetFileResponse['document'];

const mockClient = (): FigmaClient => ({
  getFile: vi.fn().mockResolvedValue({ document, lastModified: '2026-11-01' }),
  getSvgUrls: vi.fn(async (_fileKey: string, ids: string[]) => ({
    err: null,
    images: Object.fromEntries(ids.map((id) => [id, `https://s3/${id}`])),
  })),
  download: vi.fn(async (url: string) => `<svg data-url="${url}"/>`),
  getLocalVariables: vi.fn(),
  postVariables: vi.fn(),
});

describe('findIconComponents', () => {
  it('only walks the icons canvas', () => {
    expect(
      findIconComponents(document, 'Icons')
        .map(({ id }) => id)
        .sort(),
    ).toEqual(['1:1', '1:3', '1:4']);
  });
});

describe('extractIcons', () => {
  it('renders every icon to SVG and keeps the first of two same-named icons', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const client = mockClient();

    const icons = await extractIcons(client, {
      fileKey: 'FILE',
      canvas: 'Icons',
    });

    expect(Object.keys(icons.svgs).sort()).toEqual([
      'arrow-up.svg',
      'check.svg',
    ]);
    expect(icons.lastModified).toBe('2026-11-01');
    expect(warn).toHaveBeenCalledWith('⚠️ Duplicate icon names found:', [
      'arrow-up',
    ]);
    warn.mockRestore();
  });

  it('downloads at most 10 icons at a time', async () => {
    const client = mockClient();
    const many = {
      ...document,
      children: [
        {
          id: '1:0',
          name: 'Icons',
          type: 'CANVAS',
          children: Array.from({ length: 25 }, (_, i) => ({
            id: `9:${i}`,
            name: `icon-${i}`,
            type: 'COMPONENT',
            children: [],
          })),
        },
      ],
    } as unknown as GetFileResponse['document'];
    vi.mocked(client.getFile).mockResolvedValue({
      document: many,
      lastModified: 'x',
    } as never);
    let active = 0;
    let peak = 0;
    vi.mocked(client.download).mockImplementation(async () => {
      active++;
      peak = Math.max(peak, active);
      await new Promise((resolve) => setTimeout(resolve, 1));
      active--;
      return '<svg/>';
    });

    const icons = await extractIcons(client, {
      fileKey: 'FILE',
      canvas: 'Icons',
    });

    expect(Object.keys(icons.svgs)).toHaveLength(25);
    expect(peak).toBeLessThanOrEqual(10);
  });

  it('fails when Figma renders no SVG for an icon', async () => {
    const client = mockClient();
    vi.mocked(client.getSvgUrls).mockResolvedValue({
      err: null,
      images: {},
    } as never);

    await expect(
      extractIcons(client, { fileKey: 'FILE', canvas: 'Icons' }),
    ).rejects.toThrow('Figma rendered no SVG');
  });
});
