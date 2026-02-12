import {
  AmountDisplay,
  IconButton,
  FormattedValue,
} from '@ledgerhq/lumen-ui-rnative';
import { useStyleSheet, useTheme } from '@ledgerhq/lumen-ui-rnative/styles';
import { Eye, EyeCross } from '@ledgerhq/lumen-ui-rnative/symbols';
import { useState } from 'react';
import { View, Text } from 'react-native';

const eurFormatter = (value: number): FormattedValue => {
  const [integerPart, decimalPart] = value.toFixed(2).split(/\.|,/);

  return {
    integerPart,
    decimalPart,
    currencyText: '€',
    decimalSeparator: ',',
    currencyPosition: 'end',
  };
};

const usdFormatter = (value: number): FormattedValue => {
  const [integerPart, decimalPart] = value.toFixed(2).split(/\.|,/);

  return {
    integerPart,
    decimalPart,
    currencyText: '$',
    decimalSeparator: '.',
    currencyPosition: 'start',
  };
};

export function AmountDisplays() {
  const [hidden, setHidden] = useState(false);
  const styles = useStyles();
  const { theme } = useTheme();

  return (
    <View style={{ width: theme.sizes.full }}>
      <View style={{ alignItems: 'center' }}>
        <View style={styles.sectionContainer}>
          <AmountDisplay value={1234.56} formatter={eurFormatter} />
          <Text style={styles.sectionDescription}>EUR formatted</Text>
        </View>
        <View style={styles.sectionContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <AmountDisplay
              value={9876.54}
              formatter={usdFormatter}
              hidden={hidden}
            />
            <IconButton
              appearance='transparent'
              size='sm'
              icon={hidden ? EyeCross : Eye}
              accessibilityLabel={hidden ? 'Show amount' : 'Hide amount'}
              onPress={() => setHidden((v) => !v)}
            />
          </View>
          <Text style={styles.sectionDescription}>With hide button</Text>
        </View>
        <View style={styles.sectionContainer}>
          <AmountDisplay
            value={1234.56}
            formatter={eurFormatter}
            loading={true}
          />
          <Text style={styles.sectionDescription}>With loading state</Text>
        </View>
      </View>
    </View>
  );
}

const useStyles = () => {
  return useStyleSheet(
    (t) => ({
      sectionContainer: {
        alignItems: 'center',
        marginTop: t.spacings.s16,
      },
      sectionDescription: {
        marginTop: t.spacings.s8,
        color: t.colors.text.muted,
        ...t.typographies.body2,
      },
    }),
    [],
  );
};
