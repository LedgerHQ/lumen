import { StyledViewProps } from '../../../styles';

export type SkeletonProps = {
  /**
   * Pre-built skeleton component variant
   * - `list-item`: Horizontal layout with circle and two text lines
   * - `tile`: Vertical centered layout with circle and two text lines in a rounded container
   */
  component?: 'list-item' | 'tile';
} & Omit<StyledViewProps, 'children'>;
