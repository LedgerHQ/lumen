import Svg, { Path } from 'react-native-svg';
import { useCommonTranslation } from '../../../i18n';
import { LumenTextStyle, useResolveTextStyle, useTheme } from '../../../styles';
import { Spin } from '../../Animations/Spin/';
import { Box } from '../Utility';
import { SpinnerProps } from './types';

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
  ref,
  ...props
}: SpinnerProps) => {
  const { t } = useCommonTranslation();
  const { theme } = useTheme();
  const resolvedColorStyle = useResolveTextStyle({ color } as LumenTextStyle);
  const strokeColor =
    resolvedColorStyle?.color ?? color ?? theme.colors.text.base;

  return (
    <Box ref={ref} lx={{ flexShrink: 0, ...lx }} {...props}>
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
            strokeWidth='1.5'
            strokeLinecap='round'
          />
        </Svg>
      </Spin>
    </Box>
  );
};

Spinner.displayName = 'Spinner';
