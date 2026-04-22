import {
  Avatar,
  DotCount,
  Box,
  InteractiveIcon,
  MediaImage,
  SegmentedControl,
  SegmentedControlButton,
} from '@ledgerhq/lumen-ui-rnative';
import { Coins } from '@ledgerhq/lumen-ui-rnative/symbols';

export function DotCounts() {
  return (
    <Box lx={{ gap: 's24' }}>
      <Box lx={{ gap: 's12', flexDirection: 'row', alignItems: 'center' }}>
        <DotCount value={1} size='md' />
        <DotCount value={100} size='md' />
        <DotCount value={100} max={34} size='md' />
        <DotCount value={0} size='md' />
        <DotCount value={1} appearance='negative' size='md' />
        <DotCount value={32} size='md' disabled />
      </Box>
      <Box lx={{ gap: 's12', flexDirection: 'row', alignItems: 'center' }}>
        <DotCount value={1} size='sm' />
        <DotCount value={100} size='sm' />
        <DotCount value={100} max={34} size='sm' />
        <DotCount value={0} size='sm' />
        <DotCount value={1} appearance='negative' size='sm' />
        <DotCount value={32} size='sm' disabled />
      </Box>
      <Box lx={{ gap: 's12', flexDirection: 'row', alignItems: 'center' }}>
        <DotCount value={5} size='sm'>
          <MediaImage
            src='https://crypto-icons.ledger.com/BTC.png'
            alt='Bitcoin'
            size={40}
            shape='circle'
          />
        </DotCount>
        <DotCount value={100} size='sm'>
          <Avatar
            src={
              'https://plus.unsplash.com/premium_photo-1689551670902-19b441a6afde?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            }
            size='md'
          />
        </DotCount>
        <DotCount value={6} size='md' disabled>
          <InteractiveIcon size={48} icon={Coins} iconType='stroked' disabled />
        </DotCount>
      </Box>
      <SegmentedControl
        selectedValue={'preview'}
        onSelectedChange={() => ''}
        tabLayout='fit'
        accessibilityLabel='Fit layout'
      >
        <SegmentedControlButton value='preview'>
          <>
            Preview
            <DotCount
              value={3}
              size='sm'
              style={{ marginLeft: 8, marginBottom: -3 }}
            />
          </>
        </SegmentedControlButton>
        <SegmentedControlButton value='raw'>Raw</SegmentedControlButton>
        <SegmentedControlButton value='blame'>Blame</SegmentedControlButton>
      </SegmentedControl>
    </Box>
  );
}
