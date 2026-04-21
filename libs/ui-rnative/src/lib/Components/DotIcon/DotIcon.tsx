import { StyleSheet } from 'react-native';
import { useStyleSheet } from '../../../styles';
import type { IconSize } from '../Icon';
import { Box } from '../Utility';
import type {
  DotIconAppearance,
  DotIconPin,
  DotIconProps,
  DotIconSize,
} from './types';

type BorderRadiusKey = 'xs' | 'sm' | 'md' | 'lg' | 'full';

const shapeRadiusMap: Record<DotIconSize, BorderRadiusKey> = {
  16: 'sm',
  20: 'sm',
  24: 'md',
};

const dotIconSizeMap: Record<DotIconSize, IconSize> = {
  16: 12,
  20: 12,
  24: 16,
};

export const mediaImageDotIconSizeMap = {
  40: 16,
  48: 20,
  56: 24,
  64: 24,
} as const satisfies Record<number, DotIconSize>;

export const spotDotIconSizeMap = {
  40: 16,
  48: 20,
  56: 24,
  72: 24,
} as const satisfies Record<number, DotIconSize>;

const pinAxisMap: Record<DotIconPin, [vertical: string, horizontal: string]> = {
  'top-start': ['top', 'left'],
  'top-end': ['top', 'right'],
  'bottom-start': ['bottom', 'left'],
  'bottom-end': ['bottom', 'right'],
};

const getPinOffset = (pin: DotIconPin): Record<string, number> => {
  const [v, h] = pinAxisMap[pin];
  return { [v]: -3, [h]: -3 };
};

const appearanceBgMap: Record<
  DotIconAppearance,
  'successStrong' | 'mutedStrong' | 'errorStrong'
> = {
  success: 'successStrong',
  muted: 'mutedStrong',
  error: 'errorStrong',
};

const useStyles = ({
  size,
  shape,
  pin,
  appearance,
}: {
  size: DotIconSize;
  shape: 'square' | 'circle';
  pin: DotIconPin;
  appearance: DotIconAppearance;
}) => {
  return useStyleSheet(
    (t) => {
      const sizeValue = t.sizes[`s${size}` as keyof typeof t.sizes] as number;
      const radius =
        shape === 'circle'
          ? t.borderRadius.full
          : t.borderRadius[shapeRadiusMap[size]];
      const pinOffset = getPinOffset(pin);

      return {
        dot: {
          position: 'absolute',
          zIndex: 10,
          width: sizeValue,
          height: sizeValue,
          borderRadius: radius,
          borderWidth: 1,
          backgroundColor: t.colors.bg[appearanceBgMap[appearance]],
          borderColor: t.colors.border.baseInverted,
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
          ...pinOffset,
        },
        icon: {
          color: t.colors.text.onInteractive,
        },
      };
    },
    [size, shape, pin, appearance],
  );
};

/**
 * A wrapper component that positions a small icon indicator at a configurable
 * corner of a child element like MediaImage or Spot. The dot background uses a
 * semantic color (`success`, `muted`, or `error`).
 *
 * @example
 * import { DotIcon } from '@ledgerhq/lumen-ui-rnative';
 *
 * <DotIcon appearance="success" icon={ArrowDown} pin="bottom-end">
 *   <MediaImage src="https://example.com/usdc.png" alt="USDC" size={48} />
 * </DotIcon>
 */
export const DotIcon = ({
  children,
  icon: Icon,
  appearance,
  pin = 'bottom-end',
  size = 20,
  shape = 'circle',
  lx = {},
  style,
  ref,
  ...rest
}: DotIconProps) => {
  const styles = useStyles({ size, shape, pin, appearance });

  return (
    <Box
      ref={ref}
      lx={lx}
      style={StyleSheet.flatten([{ position: 'relative' }, style])}
      {...rest}
    >
      <Box style={{ alignSelf: 'flex-start', position: 'relative' }}>
        {children}
        <Box style={styles.dot}>
          <Icon size={dotIconSizeMap[size]} style={styles.icon} />
        </Box>
      </Box>
    </Box>
  );
};

DotIcon.displayName = 'DotIcon';
