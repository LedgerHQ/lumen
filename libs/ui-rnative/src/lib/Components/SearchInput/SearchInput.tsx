import { useStyleSheet } from '../../../styles';
import { Search as SearchIcon } from '../../Symbols';
import { BaseInput } from '../BaseInput';
import { type SearchInputProps } from './types';

export const SearchInput = ({
  appearance = 'plain',
  style,
  containerStyle,
  inputStyle,
  ref,
  ...props
}: SearchInputProps) => {
  const styles = useAppearanceStyles(appearance);

  return (
    <BaseInput
      ref={ref}
      prefix={<SearchIcon size={20} color='muted' accessible={false} />}
      style={style}
      containerStyle={[containerStyle, styles.container]}
      inputStyle={[inputStyle, styles.input]}
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

SearchInput.displayName = 'SearchInput';
