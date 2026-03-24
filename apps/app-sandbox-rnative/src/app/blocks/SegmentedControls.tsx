import {
  Box,
  SegmentedControl,
  SegmentedControlButton,
  Text,
} from '@ledgerhq/lumen-ui-rnative';
import { Code, Eye, EyeCross } from '@ledgerhq/lumen-ui-rnative/symbols';
import React from 'react';

export const SegmentedControls = () => {
  const [hugState, setHugState] = React.useState('preview');
  const [fixedState, setFixedState] = React.useState('preview');
  const [iconsState, setIconsState] = React.useState('preview');

  return (
    <Box lx={{ gap: 's24', width: 'full' }}>
      <Text typography='body2SemiBold' lx={{ color: 'muted' }}>
        Hug
      </Text>
      <SegmentedControl
        selectedValue={hugState}
        onSelectedChange={setHugState}
        tabLayout='hug'
        accessibilityLabel='Hug layout'
      >
        <SegmentedControlButton value='preview'>Preview</SegmentedControlButton>
        <SegmentedControlButton value='raw'>Raw</SegmentedControlButton>
        <SegmentedControlButton value='blame'>Blame</SegmentedControlButton>
      </SegmentedControl>

      <Text typography='body2SemiBold' lx={{ color: 'muted' }}>
        Fixed
      </Text>
      <SegmentedControl
        selectedValue={fixedState}
        onSelectedChange={setFixedState}
        tabLayout='fixed'
        accessibilityLabel='Fixed layout'
      >
        <SegmentedControlButton value='preview'>Preview</SegmentedControlButton>
        <SegmentedControlButton value='raw'>Raw</SegmentedControlButton>
        <SegmentedControlButton value='blame'>Blame</SegmentedControlButton>
      </SegmentedControl>

      <Text typography='body2SemiBold' lx={{ color: 'muted' }}>
        With Icons (hug)
      </Text>
      <SegmentedControl
        selectedValue={iconsState}
        onSelectedChange={setIconsState}
        tabLayout='hug'
        accessibilityLabel='File view with icons'
      >
        <SegmentedControlButton value='preview' icon={Eye}>
          Preview
        </SegmentedControlButton>
        <SegmentedControlButton value='raw' icon={Code}>
          Raw
        </SegmentedControlButton>
        <SegmentedControlButton value='blame' icon={EyeCross}>
          Blame
        </SegmentedControlButton>
      </SegmentedControl>
    </Box>
  );
};
