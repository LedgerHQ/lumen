import { Box, SegmentedControl, Text } from '@ledgerhq/lumen-ui-rnative';
import { useState } from 'react';

export const SegmentedControls = () => {
  const [value, setValue] = useState('first');

  return (
    <Box lx={{ gap: 's16', width: 'full' }}>
      <SegmentedControl value={value} onValueChange={setValue}>
        <Text>First</Text>
        <Text>Second</Text>
        <Text>Third</Text>
      </SegmentedControl>
    </Box>
  );
};
