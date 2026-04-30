import { Box, Trend } from '@ledgerhq/lumen-ui-rnative';

export function Trends() {
  return (
    <Box lx={{ gap: 's24' }}>
      <Trend value={0.24} size='md' />
    </Box>
  );
}
