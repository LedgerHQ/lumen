import { Badge, Box } from '@ledgerhq/lumen-ui-rnative';

export function Badges() {
  return (
    <Box lx={{ gap: 's8' }}>
      <Badge value={5} size='md' />
    </Box>
  );
}
