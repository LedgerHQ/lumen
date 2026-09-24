import { useDisabledContext } from '@ledgerhq/lumen-utils-shared';
import { StyleSheet, Text, View } from 'react-native';
import { useCommonTranslation } from '../../../../i18n';
import { useStyleSheet } from '../../../../styles';
import { RuntimeConstants } from '../../../utils';
import { BaseInput } from '../../internal/BaseInput';
import { QrCode } from '../../symbols';
import { InteractiveIcon } from '../InteractiveIcon';
import { type AddressInputProps } from './types';

export const AddressInput = ({
  prefix = 'To:',
  suffix,
  onQrCodeClick,
  disabled: disabledProp,
  multiline = false,
  ref,
  ...props
}: AddressInputProps) => {
  const disabled = useDisabledContext({
    consumerName: 'AddressInput',
    mergeWith: { disabled: disabledProp },
  });
  const { t } = useCommonTranslation();
  const styles = useStyles({ disabled, multiline });

  const actualPrefix = (
    <View style={styles.prefixLine}>
      <Text accessible={false} style={styles.prefix}>
        {prefix}
      </Text>
    </View>
  );

  const actualSuffix =
    suffix ||
    (onQrCodeClick && (
      <InteractiveIcon
        iconType='stroked'
        icon={QrCode}
        size={20}
        onPress={onQrCodeClick}
        accessibilityLabel={t('components.addressInput.qrCodeAriaLabel')}
      />
    ));

  return (
    <BaseInput
      ref={ref}
      prefix={actualPrefix}
      suffix={actualSuffix}
      disabled={disabledProp}
      multiline={multiline}
      {...props}
    />
  );
};

const useStyles = ({
  disabled,
  multiline,
}: {
  disabled: boolean;
  multiline: boolean;
}) => {
  return useStyleSheet(
    (t) => {
      // iOS parks field letters at the bottom of the line box, so the prefix
      // sits there too instead of being centred in it.
      const bottomAlignPrefix = multiline && RuntimeConstants.isIOS;

      return {
        prefixLine: StyleSheet.flatten([
          bottomAlignPrefix && {
            height: t.typographies.body1.lineHeight,
            justifyContent: 'flex-end' as const,
          },
        ]),
        prefix: StyleSheet.flatten([
          {
            ...t.typographies.body1,
            color: disabled ? t.colors.text.disabled : t.colors.text.base,
          },
          bottomAlignPrefix && { lineHeight: 0 },
        ]),
      };
    },
    [disabled, multiline],
  );
};
