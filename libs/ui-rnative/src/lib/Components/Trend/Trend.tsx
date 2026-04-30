import { Box, Text } from '../Utility';
import type { TrendProps } from './types';

export function Trend({ value, size }: TrendProps) {
  return (
    <Box>
      <Text>{value}</Text>
    </Box>
  );
}
