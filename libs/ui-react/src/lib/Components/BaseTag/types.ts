import type { ReactNode } from 'react';
import type { TagProps } from '../Tag/types';

export type BaseTagVariant = 'tag' | 'media';

export type BaseTagProps = Omit<TagProps, 'icon'> & {
  variant: BaseTagVariant;
  consumerName: string;
  /**
   * Content rendered before the label (icon component, image, crypto icon, etc.).
   * Color is inherited from the tag's text color so SVGs using `currentColor`
   * will pick up the correct appearance automatically.
   */
  leadingContent?: ReactNode;
};
