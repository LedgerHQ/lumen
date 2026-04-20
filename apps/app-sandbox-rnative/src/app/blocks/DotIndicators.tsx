import { Button, DotIndicator, Box } from '@ledgerhq/lumen-ui-rnative';

export function DotIndicators() {
  return (
    <Box lx={{ gap: 's24' }}>
      <Box lx={{ gap: 's12', flexDirection: 'row', alignItems: 'center' }}>
        <DotIndicator />
        <DotIndicator appearance='red' />
        <DotIndicator disabled />
      </Box>
      <Box lx={{ gap: 's12', flexDirection: 'row', alignItems: 'center' }}>
        <DotIndicator appearance='red'>
          <Button size='sm' disabled>
            Submit
          </Button>
        </DotIndicator>
      </Box>
    </Box>
  );
}
