import type { ReactNode } from 'react';
import type { StyledTextProps, StyledViewProps } from '../../../styles';
import type { InteractiveIconProps } from '../InteractiveIcon';

export type SubheaderProps = {
  /**
   * The children of the subheader, which should include SubheaderRow, SubheaderTitle, SubheaderDescription, etc.
   */
  children?: ReactNode;
} & Omit<StyledViewProps, 'children'>;

export type SubheaderRowProps = {
  /**
   * The children of the subheader row.
   */
  children: ReactNode;
  /**
   * Optional press handler to make the row interactive.
   */
  onPress?: () => void;
} & Omit<StyledViewProps, 'children'>;

export type SubheaderTitleProps = {
  /**
   * The title text of the subheader.
   */
  children: string;
} & Omit<StyledTextProps, 'children'>;

export type SubheaderCountProps = {
  /**
   * The count value to display.
   */
  value: number;
  /**
   * Optional formatter function to customize the display.
   * Defaults to (n) => `(${n})`
   */
  format?: (value: number) => string;
} & Omit<StyledTextProps, 'children'>;

export type SubheaderInfoProps = Omit<
  InteractiveIconProps,
  'icon' | 'size' | 'iconType'
> & {
  /**
   * The visual style of the icon button.
   * Defaults to 'stroked'.
   */
  iconType?: 'filled' | 'stroked';
};

export type SubheaderDescriptionProps = {
  /**
   * The description text to display below the title row.
   */
  children: ReactNode;
} & Omit<StyledTextProps, 'children'>;

export type SubheaderShowMoreProps = Omit<StyledViewProps, 'children'>;
