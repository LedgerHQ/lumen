import { Banner, Box } from '@ledgerhq/lumen-ui-rnative';

export const Banners = () => {
  return (
    <Box lx={{ flexDirection: 'row', flexWrap: 'wrap', gap: 's8' }}>
      <Banner appearance='info' title='Info' description='Info description' />
      <Banner
        appearance='success'
        title='Success'
        description='Success description'
      />
      <Banner
        appearance='warning'
        title='Warning'
        description='Warning description'
      />
      <Banner
        appearance='error'
        title='Error'
        description='Error description'
      />
    </Box>
  );
};
