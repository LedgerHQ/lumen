import { Box, Trend } from '@ledgerhq/lumen-ui-rnative';

export function Trends() {
  return (
    <Box lx={{ gap: 's24' }}>
      <Box lx={{ gap: 's16', flexDirection: 'row' }}>
        <Trend value={0.24} size='sm' />
        <Trend value={0.24} size='md' />
      </Box>
      <Box lx={{ gap: 's16', flexDirection: 'row' }}>
        <Trend value={-1.33} size='sm' />
        <Trend value={-1.33} size='md' />
      </Box>
      <Box lx={{ gap: 's16', flexDirection: 'row' }}>
        <Trend value={0} size='sm' />
        <Trend value={0} size='md' />
      </Box>
    </Box>
  );
}
