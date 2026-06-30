import { Box, Spot } from '@ledgerhq/lumen-ui-rnative';
import { ExternalLink } from '@ledgerhq/lumen-ui-rnative/symbols';

export const Spots = () => {
  return (
    <Box lx={{ gap: 's32' }}>
      <Box lx={{ flexDirection: 'row', flexWrap: 'wrap', gap: 's8' }}>
        <Spot appearance='icon' icon={ExternalLink} />
        <Spot appearance='icon' icon={ExternalLink} disabled />
        <Spot appearance='number' number={5} />
        <Spot appearance='bluetooth' />
        <Spot appearance='check' />
        <Spot appearance='error' />
        <Spot appearance='warning' />
        <Spot appearance='info' />
        <Spot appearance='loader' />
      </Box>
      <Box lx={{ flexDirection: 'row', gap: 's8' }}>
        <Spot appearance='icon' icon={ExternalLink} size={48} />
        <Spot appearance='icon' icon={ExternalLink} size={56} />
        <Spot appearance='icon' icon={ExternalLink} size={72} />
      </Box>
    </Box>
  );
};
