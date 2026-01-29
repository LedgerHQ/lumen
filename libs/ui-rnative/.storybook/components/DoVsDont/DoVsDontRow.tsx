import { PropsWithChildren } from 'react';
import { Box } from '../../../src/lib/Components/Utility';

type DoVsDontRowProps = PropsWithChildren & {};

export const DoVsDontRow = ({ children }: DoVsDontRowProps) => {
  return (
    <Box lx={{ gap: 's16' }}>
      <Box lx={{ flexDirection: 'row', gap: 's16', flexWrap: 'wrap' }}>
        {children}
      </Box>
    </Box>
  );
};
