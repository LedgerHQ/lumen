import type { HTMLAttributes, ReactNode } from 'react';

export type SectionHeaderAppearance = 'no-background' | 'card';

export type SectionHeaderProps = {
  /**
   * The visual style of the section header container.
   * @default 'no-background'
   */
  appearance?: SectionHeaderAppearance;
  /**
   * The children of the section header, typically SectionHeaderLeading and SectionHeaderTitle.
   */
  children?: ReactNode;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

export type SectionHeaderLeadingProps = {
  /**
   * Optional leading content such as an icon.
   */
  children?: ReactNode;
} & Omit<HTMLAttributes<HTMLSpanElement>, 'children'>;

export type SectionHeaderTitleProps = {
  /**
   * The label text of the section header.
   */
  children: string;
} & Omit<HTMLAttributes<HTMLSpanElement>, 'children'>;
