import Svg, { Path } from 'react-native-svg';
import createIcon from '../../internal/Icon/createIcon';

/**
 * MoreHorizontal icon component for React Native.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props (from react-native-svg)
 * and additional size variants defined in the Icon component.
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [color] - The color of the icon.
 * @param {SVGProps} [...props] - All standard SVG element props (from react-native-svg).
 *
 * @example
 * // Basic usage with default size (24px)
 * import { MoreHorizontal } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <MoreHorizontal />
 *
 * @example
 * // With custom size and style
 * <MoreHorizontal size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={MoreHorizontal} size="md">
 *   Click me
 * </Button>
 */
export const MoreHorizontal = createIcon(
  'MoreHorizontal',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M11.66 8a.33.33 0 0 0 .333.333c.18 0 .334-.146.334-.333a.34.34 0 0 0-.334-.333.336.336 0 0 0-.333.34M7.66 8a.33.33 0 0 0 .333.333c.18 0 .334-.146.334-.333a.34.34 0 0 0-.334-.333.336.336 0 0 0-.333.34M3.66 8a.33.33 0 0 0 .333.333c.18 0 .334-.146.334-.333a.34.34 0 0 0-.334-.333.336.336 0 0 0-.333.34'
    />
  </Svg>,
);
