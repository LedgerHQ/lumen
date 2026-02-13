import {
  Box,
  Text,
  IconButton,
  PageIndicator,
} from '@ledgerhq/lumen-ui-rnative';
import { useTheme } from '@ledgerhq/lumen-ui-rnative/styles';
import { ArrowLeft, ArrowRight } from '@ledgerhq/lumen-ui-rnative/symbols';
import { useState } from 'react';

export const PageIndicators = () => {
  const [page, setPage] = useState(1);
  const totalPages = 9;
  const { theme } = useTheme();

  return (
    <Box lx={{ gap: 's32', width: 'full' }}>
      <Box lx={{ gap: 's16', alignItems: 'center' }}>
        <Box
          lx={{
            flexDirection: 'row',
            gap: 's16',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <IconButton
            icon={ArrowLeft}
            size='xs'
            accessibilityLabel='Left'
            appearance='transparent'
            onPress={() => setPage((v) => Math.max(1, v - 1))}
          />
          <Text
            lx={{ color: 'base', width: 's28', textAlign: 'center' }}
            style={{ ...theme.typographies.heading2SemiBold }}
          >
            {page}
          </Text>
          <IconButton
            icon={ArrowRight}
            size='xs'
            accessibilityLabel='Right'
            appearance='transparent'
            onPress={() => setPage((v) => Math.min(totalPages, v + 1))}
          />
        </Box>
        <PageIndicator currentPage={page} totalPages={totalPages} />
      </Box>
    </Box>
  );
};
