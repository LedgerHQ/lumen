import { Button, DotIndicator, Box, Avatar } from '@ledgerhq/lumen-ui-rnative';

export function DotIndicators() {
  return (
    <Box lx={{ gap: 's24' }}>
      <Box lx={{ gap: 's12', flexDirection: 'row', alignItems: 'center' }}>
        <DotIndicator size='xs' />
        <DotIndicator size='sm' />
        <DotIndicator size='md' />
        <DotIndicator size='lg' />
      </Box>
      <Box lx={{ gap: 's12', flexDirection: 'row', alignItems: 'center' }}>
        <DotIndicator />
        <DotIndicator appearance='red' />
        <DotIndicator disabled />
      </Box>
      <Box lx={{ gap: 's12', flexDirection: 'row', alignItems: 'center' }}>
        <Avatar size='md' showNotification />
        <DotIndicator appearance='red'>
          <Button size='sm' disabled>
            Submit
          </Button>
        </DotIndicator>
      </Box>
    </Box>
  );
}
