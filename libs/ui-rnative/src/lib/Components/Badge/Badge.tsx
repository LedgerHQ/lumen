import { Box, Text } from '../Utility';
import { BadgeProps } from './types';

export function Badge({ value }: BadgeProps) {
  return (
    <Box lx={{}}>
      <Text>{value}</Text>
    </Box>
  );
}
