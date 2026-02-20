import { Box } from '../Utility';
import { SegmentedControlProps } from './types';

export function SegmentedControl({
  value,
  onValueChange,
  children,
  ...props
}: SegmentedControlProps) {
  // TODO: implement
  return <Box {...props}>{children}</Box>;
}

SegmentedControl.displayName = 'SegmentedControl';
