import { useDisabledContext } from '@ledgerhq/lumen-utils-shared';
import { useStyleSheet } from '../../../styles';
import { Search as SearchIcon } from '../../Symbols';
import { BaseInput } from '../BaseInput';
import { type SearchInputProps } from './types';

export const SearchInput = ({
  appearance = 'plain',
  style,
  containerStyle,
  inputStyle,
  disabled: disabledProp,
  ref,
  ...props
}: SearchInputProps) => {
  const disabled = useDisabledContext({
    consumerName: 'SearchInput',
    mergeWith: { disabled: disabledProp },
  });
  const styles = useAppearanceStyles(appearance);

  return (
    <BaseInput
      ref={ref}
      prefix={
        <SearchIcon
          size={20}
          accessible={false}
          disabled={disabled}
          color='muted'
        />
      }
      style={style}
      containerStyle={[containerStyle, styles.container]}
      inputStyle={[inputStyle, styles.input]}
      disabled={disabledProp}
      {...props}
    />
  );
};

const useAppearanceStyles = (appearance: 'plain' | 'transparent') => {
  return useStyleSheet(
    (t) => ({
      container:
        appearance === 'transparent'
          ? { backgroundColor: t.colors.bg.mutedTransparent }
          : {},
      input: { backgroundColor: 'transparent' },
    }),
    [appearance],
  );
};
