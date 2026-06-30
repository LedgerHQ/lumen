import {
  Box,
  LinearGradient,
  RadialGradient,
} from '@ledgerhq/lumen-ui-rnative';

export const Gradients = () => {
  return (
    <Box lx={{ flexDirection: 'column', gap: 's16' }}>
      <Box lx={{ flexDirection: 'row', gap: 's8' }}>
        <LinearGradient
          direction='to-bottom'
          stops={[{ color: 'accent' }, { color: 'accent', opacity: 0 }]}
          lx={{ height: 's128', width: 's128', borderRadius: 'lg' }}
        />
        <LinearGradient
          direction='to-bottom'
          stops={[
            { color: 'accent' },
            { color: 'warningStrong' },
            { color: 'errorStrong' },
          ]}
          lx={{ height: 's128', width: 's128', borderRadius: 'lg' }}
        />
      </Box>
      <Box lx={{ flexDirection: 'row', gap: 's8' }}>
        <RadialGradient
          center={{ x: 0.5, y: 0.5 }}
          stops={[{ color: 'accent' }, { color: 'accent', opacity: 0 }]}
          lx={{ height: 's128', width: 's128', borderRadius: 'lg' }}
        />
        <RadialGradient
          center={{ x: 0.5, y: 0.5 }}
          stops={[
            { color: 'accent' },
            { color: 'active' },
            { color: 'errorStrong', opacity: 0 },
          ]}
          lx={{ height: 's128', width: 's128', borderRadius: 'lg' }}
        />
      </Box>
    </Box>
  );
};
