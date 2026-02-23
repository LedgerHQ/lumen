import {
  Box,
  SegmentedControl,
  SegmentedControlButton,
} from '@ledgerhq/lumen-ui-rnative';
import { Code, Eye, EyeCross } from '@ledgerhq/lumen-ui-rnative/symbols';
import React from 'react';

export const SegmentedControls = () => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const handleChange = (i: number) => {
    setSelectedIndex(i);
  };

  const [selectedIndexWithIcons, setSelectedIndexWithIcons] = React.useState(0);
  const handleChangeWithIcons = (i: number) => {
    setSelectedIndexWithIcons(i);
  };

  return (
    <Box lx={{ gap: 's24', width: 'full' }}>
      <SegmentedControl
        selectedIndex={selectedIndex}
        accessibilityLabel='File view'
        onChange={handleChange}
      >
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

      <SegmentedControl
        selectedIndex={selectedIndexWithIcons}
        accessibilityLabel='File view with icons'
        onChange={handleChangeWithIcons}
      >
        <SegmentedControlButton
          selected={selectedIndexWithIcons === 0}
          icon={Eye}
        >
          Preview
        </SegmentedControlButton>
        <SegmentedControlButton
          selected={selectedIndexWithIcons === 1}
          icon={Code}
        >
          Raw
        </SegmentedControlButton>
        <SegmentedControlButton
          selected={selectedIndexWithIcons === 2}
          icon={EyeCross}
        >
          Blame
        </SegmentedControlButton>
      </SegmentedControl>
    </Box>
  );
};
