import { AmountInput, IconButton } from '@ledgerhq/lumen-ui-rnative';
import { useStyleSheet, useTheme } from '@ledgerhq/lumen-ui-rnative/styles';
import { TransferVertical } from '@ledgerhq/lumen-ui-rnative/symbols';
import { useState } from 'react';
import { View, Text } from 'react-native';

export function AmountInputs() {
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');
  const [value3, setValue3] = useState('');

  const [fiatValue, setFiatValue] = useState('0');
  const [coinValue, setCoinValue] = useState('0');
  const [isCoin, setIsCoin] = useState(false);

  const [valueSmAlignStart, setValueSmAlignStart] = useState('55 555');
  const [valueSmAlignEnd, setValueSmAlignEnd] = useState('55 555');
  const [valueSmNoCurrency, setValueSmNoCurrency] = useState('55 555');

  const styles = useStyles();
  const { theme } = useTheme();

  return (
    <View style={{ width: theme.sizes.full }}>
      <View style={{ alignItems: 'center' }}>
        <View style={styles.sectionContainer}>
          <AmountInput
            value={value1}
            onChangeText={setValue1}
            currencyText='€'
            maxDecimalLength={2}
            maxIntegerLength={6}
          />
          <Text style={styles.sectionDescription}>Default</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.sectionContainer}>
          <AmountInput
            value={value2}
            onChangeText={setValue2}
            placeholder='0'
            currencyText='BTC'
            currencyPosition='right'
          />
          <Text style={styles.sectionDescription}>Right-aligned currency</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.sectionContainer}>
          <AmountInput
            value={value3}
            onChangeText={setValue3}
            placeholder='0'
            currencyText='$'
            isInvalid={Number(value3.replace(/\s/g, '')) > 10}
            maxDecimalLength={2}
          />
          <Text style={styles.sectionDescription}>With error if above $10</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.sectionContainer}>
          <View style={styles.alignRow}>
            <AmountInput
              value={valueSmAlignStart}
              onChangeText={setValueSmAlignStart}
              size='sm'
              align='start'
              currencyText='$'
            />
          </View>
          <Text style={styles.sectionDescription}>
            Size sm, align start (left)
          </Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.sectionContainer}>
          <View style={styles.alignRow}>
            <AmountInput
              value={valueSmAlignEnd}
              onChangeText={setValueSmAlignEnd}
              size='sm'
              align='end'
              currencyText='$'
            />
          </View>
          <Text style={styles.sectionDescription}>
            Size sm, align end (right)
          </Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.sectionContainer}>
          <AmountInput
            value={valueSmNoCurrency}
            onChangeText={setValueSmNoCurrency}
            size='sm'
          />
          <Text style={styles.sectionDescription}>
            Size sm, no currency text
          </Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.sectionContainer}>
          <View style={styles.sectionContainer}>
            <AmountInput
              value={`${isCoin ? coinValue : fiatValue}`}
              onChangeText={(t) => {
                if (isCoin) {
                  setCoinValue(t);
                  setFiatValue(
                    (Number(t.replace(/\s/g, '')) * 0.04).toFixed(2),
                  );
                } else {
                  setFiatValue(t);
                  setCoinValue((Number(t.replace(/\s/g, '')) * 25).toFixed(2));
                }
              }}
              placeholder='0'
              currencyText={isCoin ? 'XRP' : '$'}
              maxDecimalLength={2}
            />
            <Text
              style={{
                color: theme.colors.text.base,
                ...theme.typographies.body2,
              }}
            >
              {isCoin ? `${fiatValue} USD` : `${coinValue} XRP`}
            </Text>
          </View>
          <IconButton
            accessibilityLabel='Flip'
            icon={TransferVertical}
            size='xs'
            appearance='gray'
            style={{
              position: 'absolute',
              top: theme.spacings.s12,
              right: theme.spacings['-s40'],
            }}
            onPress={() => setIsCoin((state) => !state)}
          />
        </View>
        <Text style={styles.sectionDescription}>Currency converter</Text>
      </View>
    </View>
  );
}

const useStyles = () => {
  return useStyleSheet(
    (t) => ({
      separator: {
        marginVertical: t.spacings.s24,
        height: t.sizes.s2,
        width: '50%',
        backgroundColor: t.colors.bg.surface,
      },
      sectionContainer: {
        alignItems: 'center',
        width: '100%',
      },
      alignRow: {
        width: '100%',
        maxWidth: 320,
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
