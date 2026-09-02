import { AddressInput } from '@ledgerhq/lumen-ui-rnative';
import { useTheme } from '@ledgerhq/lumen-ui-rnative/styles';
import { useState } from 'react';
import { Alert, View } from 'react-native';

const SAMPLE_ADDRESS = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb27';
const LONG_ADDRESS =
  'bc1p5cyxnuxmeuwuvkwfem96lqzszd02n6xdcjrs20cac6yqjjwudpxqkedrcr';

export default function AddressInputs() {
  const { theme } = useTheme();

  const [address, setAddress] = useState('');
  const [fromAddress, setFromAddress] = useState('');
  const [invalidAddress, setInvalidAddress] = useState('invalid-address');
  const [autoGrowAddress, setAutoGrowAddress] = useState(SAMPLE_ADDRESS);
  const [minLinesAddress, setMinLinesAddress] = useState('');
  const [maxLinesAddress, setMaxLinesAddress] = useState(LONG_ADDRESS);

  const openQrScanner = () =>
    Alert.alert(
      'Copied!',
      'You can now proceed with your transaction on your phone.',
    );

  return (
    <View style={{ minWidth: '100%', gap: theme.spacings.s24 }}>
      <AddressInput
        placeholder='Enter address or ENS'
        value={address}
        onChangeText={setAddress}
        onQrCodeClick={openQrScanner}
      />
      <AddressInput
        placeholder='Enter address or ENS'
        value={autoGrowAddress}
        onChangeText={setAutoGrowAddress}
        onQrCodeClick={openQrScanner}
        helperText='multiline alone — grows forever, never scrolls'
        multiline
      />
      <AddressInput
        placeholder='Enter address or ENS'
        value={minLinesAddress}
        onChangeText={setMinLinesAddress}
        onQrCodeClick={openQrScanner}
        helperText='minLines 3 — starts at 3 lines, still unbounded'
        multiline
        minLines={3}
      />
      <AddressInput
        placeholder='Enter address or ENS'
        value={maxLinesAddress}
        onChangeText={setMaxLinesAddress}
        onQrCodeClick={openQrScanner}
        helperText='maxLines 2 — starts at 1 line, scrolls past 2'
        multiline
        maxLines={2}
      />
      <AddressInput
        prefix='From:'
        placeholder='Enter sender address'
        value={fromAddress}
        onChangeText={setFromAddress}
        onQrCodeClick={openQrScanner}
      />
      <AddressInput
        placeholder='Enter address or ENS'
        value={invalidAddress}
        onChangeText={setInvalidAddress}
        helperText='Invalid address format'
        status='error'
      />
      <AddressInput
        placeholder='Enter address or ENS'
        value={SAMPLE_ADDRESS}
        disabled
      />
      <AddressInput
        placeholder='Enter address or ENS'
        value={SAMPLE_ADDRESS}
        readOnly
      />
    </View>
  );
}
