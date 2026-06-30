import { Box, Divider, Text } from '@ledgerhq/lumen-ui-rnative';

export const Dividers = () => {
  return (
    <Box lx={{ gap: 's32' }}>
      {/* Horizontal Dividers */}
      <Box lx={{ gap: 's8' }}>
        <Text typography='body3' lx={{ color: 'muted' }}>
          Horizontal
        </Text>
        <Box lx={{ gap: 's16' }}>
          <Text typography='body2' lx={{ color: 'base' }}>
            Content above
          </Text>
          <Divider />
          <Text typography='body2' lx={{ color: 'base' }}>
            Content below
          </Text>
        </Box>
      </Box>

      {/* Vertical Dividers */}
      <Box lx={{ gap: 's8' }}>
        <Text typography='body3' lx={{ color: 'muted' }}>
          Vertical
        </Text>
        <Box lx={{ flexDirection: 'row', alignItems: 'center', gap: 's16' }}>
          <Text typography='body2' lx={{ color: 'base' }}>
            Left
          </Text>
          <Divider orientation='vertical' lx={{ height: 's48' }} />
          <Text typography='body2' lx={{ color: 'base' }}>
            Right
          </Text>
        </Box>
      </Box>

      {/* In a List */}
      <Box lx={{ gap: 's8' }}>
        <Text typography='body3' lx={{ color: 'muted' }}>
          In a List
        </Text>
        <Box
          lx={{
            backgroundColor: 'canvas',
            borderRadius: 'lg',
            borderWidth: 's1',
            borderColor: 'muted',
          }}
        >
          <Box lx={{ padding: 's16' }}>
            <Text typography='body2' lx={{ color: 'base' }}>
              Item 1
            </Text>
          </Box>
          <Divider />
          <Box lx={{ padding: 's16' }}>
            <Text typography='body2' lx={{ color: 'base' }}>
              Item 2
            </Text>
          </Box>
          <Divider />
          <Box lx={{ padding: 's16' }}>
            <Text typography='body2' lx={{ color: 'base' }}>
              Item 3
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
