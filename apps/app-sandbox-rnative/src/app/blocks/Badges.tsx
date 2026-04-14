import {
  Avatar,
  Badge,
  Box,
  Button,
  InteractiveIcon,
  MediaImage,
  SegmentedControl,
  SegmentedControlButton,
} from '@ledgerhq/lumen-ui-rnative';
import { Coins } from '@ledgerhq/lumen-ui-rnative/symbols';

export function Badges() {
  return (
    <Box lx={{ gap: 's24' }}>
      <Box lx={{ gap: 's12', flexDirection: 'row', alignItems: 'center' }}>
        <Badge value={1} size='md' />
        <Badge value={100} size='md' />
        <Badge value={100} max={34} size='md' />
        <Badge value={0} size='md' />
        <Badge value={1} appearance='red' size='md' />
        <Badge value={32} size='md' disabled />
      </Box>
      <Box lx={{ gap: 's12', flexDirection: 'row', alignItems: 'center' }}>
        <Badge value={1} size='sm' />
        <Badge value={100} size='sm' />
        <Badge value={100} max={34} size='sm' />
        <Badge value={0} size='sm' />
        <Badge value={1} appearance='red' size='sm' />
        <Badge value={32} size='sm' disabled />
      </Box>
      <Box lx={{ gap: 's12', flexDirection: 'row', alignItems: 'center' }}>
        <Badge value={1} size='xs' />
        <Badge value={100} size='xs' />
        <Badge value={100} max={34} size='xs' />
        <Badge value={0} size='xs' />
        <Badge value={1} appearance='red' size='xs' />
        <Badge value={32} size='xs' disabled />
      </Box>
      <Box lx={{ gap: 's12', flexDirection: 'row', alignItems: 'center' }}>
        <Badge value={5} size='sm'>
          <MediaImage
            src='https://crypto-icons.ledger.com/BTC.png'
            alt='Bitcoin'
            size={40}
            shape='circle'
          />
        </Badge>
        <Badge value={100} size='sm'>
          <Avatar
            src={
              'https://plus.unsplash.com/premium_photo-1689551670902-19b441a6afde?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            }
            size='md'
          />
        </Badge>
        <Badge value={99} max={99} size='xs' appearance='red'>
          <Button size='sm' disabled>
            Submit
          </Button>
        </Badge>
        <Badge value={6} size='md' disabled>
          <InteractiveIcon size={48} icon={Coins} iconType='stroked' disabled />
        </Badge>
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
            <Badge
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
