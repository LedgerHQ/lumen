import {
  Box,
  SegmentedControl,
  SegmentedControlButton,
} from '@ledgerhq/lumen-ui-rnative';
import { Code, Eye, EyeCross } from '@ledgerhq/lumen-ui-rnative/symbols';
import React from 'react';

export const SegmentedControls = () => {
  const [state, setState] = React.useState('preview');
  const [stateWithIcons, setStateWithIcons] = React.useState('preview');

  return (
    <Box lx={{ gap: 's24', width: 'full' }}>
      <SegmentedControl
        selectedValue={state}
        onSelectedChange={setState}
        accessibilityLabel='File view'
      >
        <SegmentedControlButton value='preview'>Preview</SegmentedControlButton>
        <SegmentedControlButton value='raw'>Raw</SegmentedControlButton>
        <SegmentedControlButton value='blame'>Blame</SegmentedControlButton>
      </SegmentedControl>

      <SegmentedControl
        selectedValue={stateWithIcons}
        onSelectedChange={setStateWithIcons}
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
