import {
  Button,
  DotIndicator,
  Box,
  Avatar,
  getDotIndicatorProps,
} from '@ledgerhq/lumen-ui-rnative';

export default function DotIndicators() {
  return (
    <Box lx={{ gap: 's24' }}>
      <Box lx={{ gap: 's12', flexDirection: 'row', alignItems: 'center' }}>
        <DotIndicator size='sm' />
        <DotIndicator size='md' />
        <DotIndicator size='lg' />
        <DotIndicator size='xl' />
      </Box>
      <Box lx={{ gap: 's12', flexDirection: 'row', alignItems: 'center' }}>
        <DotIndicator />
        <DotIndicator appearance='red' />
        <DotIndicator disabled />
      </Box>
      <Box lx={{ gap: 's12', flexDirection: 'row', alignItems: 'center' }}>
        <DotIndicator {...getDotIndicatorProps('avatar', 'md')}>
          <Avatar size='md' />
        </DotIndicator>
        <DotIndicator size='xl' appearance='red'>
          <Button size='sm' disabled>
            Submit
          </Button>
        </DotIndicator>
      </Box>
    </Box>
  );
}
