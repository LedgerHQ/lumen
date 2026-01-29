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
  ref,
  ...props
}: AddressInputProps) => {
  const { t } = useCommonTranslation();
  const styles = useStyles();

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
      {...props}
    />
  );
};

const useStyles = () => {
  return useStyleSheet((t) => {
    return {
      prefix: {
        ...t.typographies.body1,
        color: t.colors.text.base,
      },
    };
  }, []);
};

AddressInput.displayName = 'AddressInput';
