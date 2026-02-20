import { ReactNode } from 'react';
import { BoxProps } from '../Utility';

export type SegmentedControlProps = {
  value: string;
  onValueChange: (value: string) => void;
  children: ReactNode;
} & Omit<BoxProps, 'children'>;
