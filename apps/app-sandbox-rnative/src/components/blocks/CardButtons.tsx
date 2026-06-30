import { Box, CardButton } from '@ledgerhq/lumen-ui-rnative';
import { Settings } from '@ledgerhq/lumen-ui-rnative/symbols';

export const CardButtons = () => {
  return (
    <Box lx={{ width: 'full', flexDirection: 'row', gap: 's8' }}>
      <CardButton
        appearance='base'
        title='Info'
        icon={Settings}
        description='Info description'
      />
    </Box>
  );
};
