import { useDisabledContext } from '@ledgerhq/lumen-utils-shared';
import { StyleSheet, Text } from 'react-native';
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
    <Text accessible={false} style={styles.prefix}>
      {prefix}
    </Text>
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
    (t) => ({
      prefix: StyleSheet.flatten([
        {
          ...t.typographies.body1,
          color: disabled ? t.colors.text.disabled : t.colors.text.base,
        },
        // A multiline field top-aligns its row instead of centring it. iOS centres a
        // Text's glyph inside an explicit line height but leaves the field's at the
        // bottom of it, so only there does the prefix need the field's natural metrics
        // to share a line with it.
        multiline && RuntimeConstants.isIOS && { lineHeight: 0 },
      ]),
    }),
    [disabled, multiline],
  );
};
