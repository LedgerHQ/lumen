import { useDisabledContext } from '@ledgerhq/lumen-utils-shared';
import { Text } from 'react-native';
import { useCommonTranslation } from '../../../i18n';
import { useStyleSheet } from '../../../styles';
import { QrCode } from '../../Symbols';
import { BaseInput } from '../BaseInput';
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
        onPress={onQrCodeClick}
        accessibilityLabel={t('components.addressInput.qrCodeAriaLabel')}
      >
        <QrCode size={20} />
      </InteractiveIcon>
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
      prefix: {
        ...t.typographies.body1,
        color: disabled ? t.colors.text.disabled : t.colors.text.base,
      },
    }),
    [disabled],
  );
};

AddressInput.displayName = 'AddressInput';
