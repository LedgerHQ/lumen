import {
  Box,
  SegmentedControl,
  SegmentedControlButton,
} from '@ledgerhq/lumen-ui-rnative';
import React from 'react';

export const SegmentedControls = () => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const handleChange = (i: number) => {
    setSelectedIndex(i);
  };

  return (
    <Box lx={{ gap: 's16', width: 'full' }}>
      <SegmentedControl accessibilityLabel='File view' onChange={handleChange}>
        <SegmentedControlButton selected={selectedIndex === 0}>
          Preview
        </SegmentedControlButton>
        <SegmentedControlButton selected={selectedIndex === 1}>
          Raw
        </SegmentedControlButton>
        <SegmentedControlButton selected={selectedIndex === 2}>
          Blame
        </SegmentedControlButton>
      </SegmentedControl>
    </Box>
  );
};
