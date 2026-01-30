import { ReactNode } from 'react';
import { BoxProps } from '../Utility';

export type NavBarProps = {
  /**
   * The content of the NavBar.
   */
  children: ReactNode;
} & Omit<BoxProps, 'children'>;
