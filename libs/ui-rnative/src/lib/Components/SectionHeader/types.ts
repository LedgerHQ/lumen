import type { ReactNode } from 'react';
import type { StyledTextProps, StyledViewProps } from '../../../styles';

export type SectionHeaderAppearance = 'no-background' | 'plain';

export type SectionHeaderProps = {
  /**
   * The visual style of the section header container.
   * @default 'no-background'
   */
  appearance?: SectionHeaderAppearance;
  /**
   * The children of the section header: SectionHeaderLeading and SectionHeaderTitle.
   */
  children?: ReactNode;
} & Omit<StyledViewProps, 'children'>;

export type SectionHeaderLeadingProps = {
  /**
   * Optional leading content such as an icon.
   */
  children?: ReactNode;
} & Omit<StyledViewProps, 'children'>;

export type SectionHeaderTitleProps = {
  /**
   * The label text of the section header.
   */
  children: string;
} & Omit<StyledTextProps, 'children'>;
