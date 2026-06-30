import {
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
        <DotCount value={1} size='lg' />
        <DotCount value={100} size='lg' />
        <DotCount value={100} max={34} size='lg' />
        <DotCount value={0} size='lg' />
        <DotCount value={1} appearance='red' size='lg' />
        <DotCount value={32} size='lg' disabled />
      </Box>
      <Box lx={{ gap: 's12', flexDirection: 'row', alignItems: 'center' }}>
        <DotCount value={1} size='md' />
        <DotCount value={100} size='md' />
        <DotCount value={100} max={34} size='md' />
        <DotCount value={0} size='md' />
        <DotCount value={1} appearance='red' size='md' />
        <DotCount value={32} size='md' disabled />
      </Box>
      <Box lx={{ gap: 's12', flexDirection: 'row', alignItems: 'center' }}>
        <DotCount value={5} size='md'>
          <MediaImage
            src='https://crypto-icons.ledger.com/BTC.png'
            alt='Bitcoin'
            size={40}
            shape='circle'
          />
        </DotCount>
        <DotCount value={6} size='lg' disabled>
          <InteractiveIcon size={48} icon={Coins} iconType='stroked' disabled />
        </DotCount>
      </Box>
      <SegmentedControl
        selectedValue={'preview'}
        onSelectedChange={() => ''}
        tabLayout='fit'
        accessibilityLabel='Fit layout'
      >
        <SegmentedControlButton
          value='preview'
          trailingContent={<DotCount value={3} size='md' />}
        >
          Preview
        </SegmentedControlButton>
        <SegmentedControlButton value='raw'>Raw</SegmentedControlButton>
        <SegmentedControlButton value='blame'>Blame</SegmentedControlButton>
      </SegmentedControl>
    </Box>
  );
}
