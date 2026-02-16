import { Box, Skeleton } from '@ledgerhq/lumen-ui-rnative';

export const Skeletons = () => {
  return (
    <Box lx={{ flexDirection: 'column', gap: 's16', width: 'full' }}>
      <Box lx={{ flexDirection: 'column', gap: 's8' }}>
        <Skeleton lx={{ height: 's16', width: 's256' }} />
        <Skeleton lx={{ height: 's40', width: 's192' }} />
        <Skeleton lx={{ height: 's12', width: 's320' }} />
      </Box>

      <Box lx={{ flexDirection: 'row', gap: 's12' }}>
        <Skeleton lx={{ width: 's64', height: 's64', borderRadius: 'md' }} />
        <Skeleton lx={{ width: 's48', height: 's48', borderRadius: 'full' }} />
      </Box>

      <Box lx={{ flexDirection: 'column', gap: 's12' }}>
        <Skeleton component='list-item' lx={{ width: 's320' }} />
        <Skeleton component='list-item' lx={{ width: 's320' }} />
      </Box>

      <Box lx={{ flexDirection: 'row', gap: 's12' }}>
        <Skeleton component='tile' />
        <Skeleton component='tile' />
      </Box>
    </Box>
  );
};
