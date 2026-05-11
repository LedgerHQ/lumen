import CryptoIcon from '@ledgerhq/crypto-icons/native';
import { Box, MediaTag } from '@ledgerhq/lumen-ui-rnative';

export const MediaTags = () => {
  return (
    <Box lx={{ gap: 's32' }}>
      <Box lx={{ flexDirection: 'row', flexWrap: 'wrap', gap: 's8' }}>
        <MediaTag
          appearance='accent'
          label='Accent'
          icon={<CryptoIcon ledgerId='bitcoin' ticker='BTC' size={16} />}
        />
        <MediaTag
          appearance='base'
          label='Base'
          icon={<CryptoIcon ledgerId='bitcoin' ticker='BTC' size={16} />}
        />
        <MediaTag
          appearance='gray'
          label='Gray'
          icon={<CryptoIcon ledgerId='bitcoin' ticker='BTC' size={16} />}
        />
        <MediaTag
          appearance='success'
          label='Success'
          icon={<CryptoIcon ledgerId='bitcoin' ticker='BTC' size={16} />}
        />
        <MediaTag
          appearance='error'
          label='Error'
          icon={<CryptoIcon ledgerId='bitcoin' ticker='BTC' size={16} />}
        />
        <MediaTag
          appearance='warning'
          label='Warning'
          icon={<CryptoIcon ledgerId='bitcoin' ticker='BTC' size={16} />}
        />
        <MediaTag
          label='Disabled'
          icon={<CryptoIcon ledgerId='bitcoin' ticker='BTC' size={16} />}
          disabled
        />
      </Box>
      <Box lx={{ flexDirection: 'row', gap: 's8' }}>
        <MediaTag
          appearance='accent'
          label='Accent'
          size='md'
          icon={<CryptoIcon ledgerId='bitcoin' ticker='BTC' size={16} />}
        />
        <MediaTag
          appearance='accent'
          label='Accent'
          size='sm'
          icon={<CryptoIcon ledgerId='bitcoin' ticker='BTC' size={16} />}
        />
      </Box>
    </Box>
  );
};
