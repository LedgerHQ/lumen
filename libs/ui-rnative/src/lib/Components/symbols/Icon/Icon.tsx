import { useMemo } from 'react';
import { Svg } from 'react-native-svg';
import { useResolveTextStyle, useTheme } from '../../../../styles';
import type { TextProps } from '../../primitives';
import type { IconProps, IconSize } from './types';

const ICON_VIEWBOX_SIZE = 16;

const iconSizeMap = {
  12: 's12',
  16: 's16',
  20: 's20',
  24: 's24',
  32: 's32',
  40: 's40',
  48: 's48',
  56: 's56',
} as const;

const useStyles = (
  lx: TextProps['lx'],
  size: IconSize,
  color: IconProps['color'],
) => {
  const { theme } = useTheme();

  const resolvedStyle = useResolveTextStyle({
    ...(lx || {}),
    color: color || lx?.color,
  });

  return useMemo(() => {
    const sizeKey = iconSizeMap[size];

    return {
      container: {
        ...resolvedStyle,
        width: theme.icon.width[sizeKey],
        height: theme.icon.height[sizeKey],
        // strokeWidth is resolved in viewBox user units, so the renderer scales
        // it by size / 16. Divide it out so the painted weight equals the token
        // instead of token × size / 16.
        strokeWidth:
          theme.icon.borderWidth[sizeKey] * (ICON_VIEWBOX_SIZE / size),
      },
      color: resolvedStyle.color || theme.colors.text.base,
    };
  }, [size, theme, resolvedStyle]);
};

export const Icon = ({
  size = 24,
  color,
  lx = {},
  children,
  viewBox,
  ref,
  ...props
}: IconProps) => {
  const styles = useStyles(lx, size, color);

  return (
    <Svg
      ref={ref}
      width={styles.container.width}
      height={styles.container.height}
      strokeWidth={styles.container.strokeWidth}
      viewBox={viewBox}
      color={styles.color}
      fill='none'
      style={{ pointerEvents: 'none', flexShrink: 0 }}
      {...props}
    >
      {children}
    </Svg>
  );
};
