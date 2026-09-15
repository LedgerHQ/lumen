import {
  Box,
  DotSymbol,
  getDotSymbolProps,
  Spot,
} from '@ledgerhq/lumen-ui-rnative';
import { CoinAlert, ExternalLink } from '@ledgerhq/lumen-ui-rnative/symbols';

export default function Spots() {
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
        <DotSymbol
          src='https://crypto-icons.ledger.com/BTC.png'
          pin='bottom-end'
          {...getDotSymbolProps('spot', 48)}
        >
          <Spot appearance='icon' icon={CoinAlert} />
        </DotSymbol>
      </Box>
      <Box lx={{ flexDirection: 'row', gap: 's8' }}>
        <Spot appearance='icon' icon={ExternalLink} size={48} />
        <Spot appearance='icon' icon={ExternalLink} size={56} />
        <Spot appearance='icon' icon={ExternalLink} size={72} />
      </Box>
    </Box>
  );
}
