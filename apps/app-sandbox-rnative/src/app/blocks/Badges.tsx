import { Badge, Box } from '@ledgerhq/lumen-ui-rnative';

export function Badges() {
  return (
    <Box lx={{ gap: 's24' }}>
      <Box lx={{ gap: 's12', flexDirection: 'row', alignItems: 'center' }}>
        <Badge value={1} size='md' />
        <Badge value={100} size='md' />
        <Badge value={1} appearance='red' size='md' />
        <Badge value={32} size='md' disabled />
      </Box>
      <Box lx={{ gap: 's12', flexDirection: 'row', alignItems: 'center' }}>
        <Badge value={1} size='sm' />
        <Badge value={100} size='sm' />
        <Badge value={1} appearance='red' size='sm' />
        <Badge value={32} size='sm' disabled />
      </Box>
      <Box lx={{ gap: 's12', flexDirection: 'row', alignItems: 'center' }}>
        <Badge value={1} size='xs' />
        <Badge value={1} appearance='red' size='xs' />
        <Badge value={32} size='xs' disabled />
      </Box>
    </Box>
  );
}
