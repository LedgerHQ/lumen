import { Box, Tag } from '@ledgerhq/lumen-ui-rnative';
import { ExternalLink } from '@ledgerhq/lumen-ui-rnative/symbols';

export const Tags = () => {
  return (
    <Box lx={{ gap: 's32' }}>
      <Box lx={{ flexDirection: 'row', flexWrap: 'wrap', gap: 's8' }}>
        <Tag appearance='accent' label='Accent' icon={ExternalLink} />
        <Tag appearance='accent-subtle' label='Subtle' icon={ExternalLink} />
        <Tag appearance='base' label='Base' icon={ExternalLink} />
        <Tag appearance='gray' label='Gray' icon={ExternalLink} />
        <Tag appearance='success' label='Success' icon={ExternalLink} />
        <Tag appearance='error' label='Error' icon={ExternalLink} />
        <Tag appearance='warning' label='Warning' icon={ExternalLink} />
        <Tag label='Disabled' icon={ExternalLink} disabled />
      </Box>
      <Box lx={{ flexDirection: 'row', gap: 's8' }}>
        <Tag appearance='base' label='Base' size='md' />
        <Tag appearance='base' label='Base' size='sm' />
      </Box>
    </Box>
  );
};
