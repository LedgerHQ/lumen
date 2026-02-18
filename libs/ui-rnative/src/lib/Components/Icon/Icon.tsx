import { useMemo } from 'react';
import { Svg } from 'react-native-svg';
import { useResolveTextStyle, useTheme } from '../../../styles';
import { TextProps } from '../Utility';
import { IconProps, IconSize } from './types';

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
    return {
      container: {
        ...resolvedStyle,
        width: theme.icon.width[iconSizeMap[size]],
        height: theme.icon.height[iconSizeMap[size]],
        strokeWidth: theme.icon.borderWidth[iconSizeMap[size]],
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
      style={{ pointerEvents: 'none' }}
      {...props}
    >
      {children}
    </Svg>
  );
};

Icon.displayName = 'Icon';
