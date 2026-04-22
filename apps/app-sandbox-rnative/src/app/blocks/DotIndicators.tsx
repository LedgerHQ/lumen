import { Button, DotIndicator, Box } from '@ledgerhq/lumen-ui-rnative';

export function DotIndicators() {
  return (
    <Box lx={{ gap: 's24' }}>
      <Box lx={{ gap: 's12', flexDirection: 'row', alignItems: 'center' }}>
        <DotIndicator size='sm' />
        <DotIndicator size='md' />
        <DotIndicator size='lg' />
      </Box>
      <Box lx={{ gap: 's12', flexDirection: 'row', alignItems: 'center' }}>
        <DotIndicator />
        <DotIndicator appearance='negative' />
        <DotIndicator disabled />
      </Box>
      <Box lx={{ gap: 's12', flexDirection: 'row', alignItems: 'center' }}>
        <DotIndicator appearance='negative'>
          <Button size='sm' disabled>
            Submit
          </Button>
        </DotIndicator>
      </Box>
    </Box>
  );
}
