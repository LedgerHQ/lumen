import {
  AddressInput,
  SearchInput,
  TextInput,
} from '@ledgerhq/lumen-ui-rnative';
import { useTheme } from '@ledgerhq/lumen-ui-rnative/styles';
import { Eye, EyeCross } from '@ledgerhq/lumen-ui-rnative/symbols';
import { useEffect, useState } from 'react';
import { Alert, Pressable, View } from 'react-native';

export function TextInputs() {
  const [team, setTeam] = useState<string>();
  const [isTeamValid, setIsTeamValid] = useState(true);

  useEffect(() => {
    if (team) {
      setIsTeamValid(team.toLowerCase() === 'lumen');
    }
  }, [team]);

  const [showPassword, setShowPassword] = useState(false);
  const { theme } = useTheme();

  return (
    <View style={{ minWidth: '100%', gap: 8 }}>
      <TextInput
        label='Username'
        onClear={() =>
          Alert.alert('Custom handler', 'You found an easter egg!', [
            { text: 'Okay', style: 'default' },
          ])
        }
      />
      <TextInput
        label='Password'
        secureTextEntry={!showPassword}
        hideClearButton
        suffix={
          <Pressable onPress={() => setShowPassword(!showPassword)}>
            {showPassword ? (
              <EyeCross size={20} style={{ color: theme.colors.text.base }} />
            ) : (
              <Eye size={20} style={{ color: theme.colors.text.base }} />
            )}
          </Pressable>
        }
      />
      <TextInput label='Company' defaultValue='Ledger' editable={false} />
      <TextInput
        label='Team'
        value={team}
        onChangeText={setTeam}
        errorMessage={
          !isTeamValid && team !== undefined
            ? 'Team must match "lumen"!'
            : undefined
        }
      />
      <TextInput
        label='A very long label that should really be truncated at different breakpoints'
        defaultValue='This is a default value!'
      />
      <SearchInput
        placeholder='Search for a component...'
        appearance='transparent'
      />
      <AddressInput
        placeholder='Enter address or ENS'
        onQrCodeClick={() =>
          Alert.alert(
            'Copied!',
            'You can now proceed with your transaction on your phone.',
          )
        }
      />
    </View>
  );
}
