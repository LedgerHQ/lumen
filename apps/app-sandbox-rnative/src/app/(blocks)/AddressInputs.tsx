import { AddressInput } from '@ledgerhq/lumen-ui-rnative';
import { useState } from 'react';
import { Alert, View } from 'react-native';

const SAMPLE_ADDRESS = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb27';

export default function AddressInputs() {
  const [address, setAddress] = useState('');
  const [fromAddress, setFromAddress] = useState('');
  const [invalidAddress, setInvalidAddress] = useState('invalid-address');

  const openQrScanner = () =>
    Alert.alert(
      'Copied!',
      'You can now proceed with your transaction on your phone.',
    );

  return (
    <View style={{ minWidth: '100%', gap: 8 }}>
      <AddressInput
        placeholder='Enter address or ENS'
        value={address}
        onChangeText={setAddress}
        onQrCodeClick={openQrScanner}
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
