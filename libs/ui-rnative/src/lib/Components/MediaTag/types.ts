import type { ReactNode } from 'react';
import type { TagProps } from '../Tag';

export type MediaTagProps = Omit<TagProps, 'icon'> & {
  /**
   * The media element rendered before the label (e.g. an image or a crypto icon).
   */
  icon: ReactNode;
};
