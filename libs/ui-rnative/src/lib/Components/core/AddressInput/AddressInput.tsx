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
  ref,
  ...props
}: AddressInputProps) => {
  const disabled = useDisabledContext({
    consumerName: 'AddressInput',
    mergeWith: { disabled: disabledProp },
  });
  const { t } = useCommonTranslation();
  const styles = useStyles({ disabled });

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
      {...props}
    />
  );
};

const useStyles = ({ disabled }: { disabled: boolean }) => {
  return useStyleSheet(
    (t) => ({
      prefix: StyleSheet.flatten([
        {
          ...t.typographies.body1,
          color: disabled ? t.colors.text.disabled : t.colors.text.base,
        },
        // iOS centres a Text's glyph inside an explicit line height but leaves the
        // field's at the bottom of it, so the prefix needs the field's natural metrics
        // to share a line with it.
        RuntimeConstants.isIOS && { lineHeight: 0 },
      ]),
    }),
    [disabled],
  );
};
