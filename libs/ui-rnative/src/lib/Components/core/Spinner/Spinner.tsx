import { StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import type { LumenTextStyle } from '../../../../styles';
import { useResolveTextStyle, useTheme } from '../../../../styles';
import { useCommonTranslation } from '../../../../translations';
import { Spin } from '../../animations/Spin';
import { Box } from '../../primitives';
import type { SpinnerProps } from './types';

const SPINNER_VIEWBOX_SIZE = 16;

const spinnerSizeMap = {
  12: 's12',
  16: 's16',
  20: 's20',
  24: 's24',
  32: 's32',
  40: 's40',
  48: 's48',
  56: 's56',
} as const;

/**
 * A basic spinner component for loading states.
 *
 * @example
 * <Spinner />
 *
 * @example
 * // With custom color using lx prop
 * <Spinner lx={{ color: 'interactive' }} />
 *
 * @example
 * // With lx props for layout and color
 * <Spinner lx={{ marginTop: 's8', color: 'muted' }} />
 */
export const Spinner = ({
  lx = {},
  size = 16,
  color,
  style,
  ref,
  ...props
}: SpinnerProps) => {
  const { t } = useCommonTranslation();
  const { theme } = useTheme();
  const resolvedColorStyle = useResolveTextStyle({ color } as LumenTextStyle);
  const flatStyle = StyleSheet.flatten(style);
  const styleColor = flatStyle?.color;
  const strokeColor =
    resolvedColorStyle?.color ?? color ?? styleColor ?? theme.colors.text.base;
  // strokeWidth is resolved in viewBox user units, so the renderer scales it
  // by size / 16. Divide it out so the painted weight equals the token.
  const strokeWidth =
    theme.spinner.borderWidth[spinnerSizeMap[size]] *
    (SPINNER_VIEWBOX_SIZE / size);

  return (
    <Box ref={ref} lx={{ flexShrink: 0, ...lx }} style={style} {...props}>
      <Spin>
        <Svg
          width={size}
          height={size}
          viewBox='0 0 16 16'
          fill='none'
          accessibilityLabel={t('components.spinner.loadingAriaLabel')}
        >
          <Path
            d='M8 1.5C11.5899 1.5 14.5 4.41015 14.5 8C14.5 11.5899 11.5899 14.5 8 14.5C4.41015 14.5 1.5 11.5899 1.5 8'
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap='round'
          />
        </Svg>
      </Spin>
    </Box>
  );
};
