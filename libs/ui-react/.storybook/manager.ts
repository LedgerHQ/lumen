import { createElement } from 'react';
import type { ReactNode } from 'react';
import { addons } from 'storybook/manager-api';
import theme from './theme';

type SidebarEntryWithTags = {
  type?: string;
  tags?: readonly string[];
};

type FlagTag = 'deprecated' | 'experimental' | 'new' | 'beta' | 'alpha';

const FLAG_TAGS: readonly FlagTag[] = [
  'deprecated',
  'experimental',
  'new',
  'beta',
  'alpha',
];

const getFlagTags = (tags?: readonly string[]): readonly FlagTag[] => {
  if (!tags?.length) return [];
  return FLAG_TAGS.filter((t) => tags.includes(t));
};

const badgeStyleFor = (
  tag: FlagTag,
): { background: string; border: string; color: string } => {
  switch (tag) {
    case 'deprecated':
      return { background: '#F8F1F1', border: '#E5C6C6', color: '#8A2E2E' };
    case 'experimental':
      return { background: '#F3F0FA', border: '#D7CFF3', color: '#5632B3' };
    case 'new':
      return { background: '#EEF7F2', border: '#BFE2CE', color: '#1F6B3A' };
    case 'beta':
      return { background: '#FFF7E6', border: '#FFD699', color: '#8A5200' };
    case 'alpha':
      return { background: '#E9F3FF', border: '#B3D7FF', color: '#0B4C8A' };
  }
};

const renderFlagBadge = (tag: FlagTag): ReactNode => {
  const styles = badgeStyleFor(tag);

  return createElement(
    'span',
    {
      key: tag,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        height: 16,
        padding: '2px 6px',
        borderRadius: 999,
        border: `1px solid ${styles.border}`,
        background: styles.background,
        color: styles.color,
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: 0.2,
        textTransform: 'uppercase',
        lineHeight: '16px',
      },
    },
    tag,
  );
};

const renderLabelWithFlags = (
  item: { name: string } & Partial<SidebarEntryWithTags>,
): ReactNode => {
  if (item.type !== 'component') {
    return item.name;
  }

  const flagTags = getFlagTags(item.tags);

  if (!flagTags.length) return item.name;

  const badges = flagTags.slice(0, 2).map(renderFlagBadge);

  return createElement(
    'span',
    {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        minWidth: 0,
      },
    },
    createElement('span', { style: { minWidth: 0 } }, item.name),
    ...badges,
  );
};

addons.setConfig({
  theme,
  sidebar: {
    renderLabel: (item) =>
      renderLabelWithFlags(item as { name: string } & SidebarEntryWithTags),
  },
});
