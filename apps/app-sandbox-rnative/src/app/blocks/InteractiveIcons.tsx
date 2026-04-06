import { Box, InteractiveIcon, Text } from '@ledgerhq/lumen-ui-rnative';
import { Heart, Star } from '@ledgerhq/lumen-ui-rnative/symbols';

const SIZES = [12, 16, 20, 24, 32, 40, 48, 56] as const;

export const InteractiveIcons = () => {
  return (
    <Box lx={{ width: 'full', gap: 's16' }}>
      <Box>
        <Text typography='body2' lx={{ color: 'base' }}>
          Stroked
        </Text>
        <Box lx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {SIZES.map((size) => (
            <InteractiveIcon
              key={`stroked-${size}`}
              iconType='stroked'
              icon={Heart}
              size={size}
              accessibilityLabel='Go to Ledger Shop'
            />
          ))}
        </Box>
      </Box>

      <Box>
        <Text typography='body2' lx={{ color: 'base' }}>
          Filled
        </Text>
        <Box lx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {SIZES.map((size) => (
            <InteractiveIcon
              key={`filled-${size}`}
              iconType='filled'
              icon={Star}
              size={size}
              accessibilityLabel='Go to Ledger Shop'
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};
