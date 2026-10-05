import {
  Box,
  DotSymbol,
  getDotSymbolProps,
  Spinner,
  Spot,
} from '@ledgerhq/lumen-ui-rnative';
import {
  CheckmarkCircleFill,
  CoinAlert,
  DeleteCircleFill,
  ExternalLink,
  InformationFill,
  WarningFill,
} from '@ledgerhq/lumen-ui-rnative/symbols';

export default function Spots() {
  return (
    <Box lx={{ gap: 's32' }}>
      <Box lx={{ flexDirection: 'row', flexWrap: 'wrap', gap: 's8' }}>
        <Spot icon={ExternalLink} />
        <Spot icon={ExternalLink} disabled />
        <Spot appearance='success' icon={CheckmarkCircleFill} />
        <Spot appearance='error' icon={DeleteCircleFill} />
        <Spot appearance='warning' icon={WarningFill} />
        <Spot appearance='muted' icon={InformationFill} />
        <Spot icon={Spinner} appearance='success' fill='plain' />
        <Spot appearance='success' fill='plain' icon={ExternalLink} />
        <DotSymbol
          src='https://crypto-icons.ledger.com/BTC.png'
          pin='bottom-end'
          {...getDotSymbolProps('spot', 48)}
        >
          <Spot icon={CoinAlert} />
        </DotSymbol>
      </Box>
      <Box lx={{ flexDirection: 'row', gap: 's8' }}>
        <Spot icon={ExternalLink} size={48} />
        <Spot icon={ExternalLink} size={56} />
        <Spot icon={ExternalLink} size={72} />
      </Box>
    </Box>
  );
}
