import Svg, { Path } from 'react-native-svg';
import createIcon from '../../Components/Icon/createIcon';

/**
 * LifeRingFill icon component for React Native.
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
 * import { LifeRingFill } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <LifeRingFill />
 *
 * @example
 * // With custom size and style
 * <LifeRingFill size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={LifeRingFill} size="md">
 *   Click me
 * </Button>
 */
export const LifeRingFill = createIcon(
  'LifeRingFill',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      fill='currentColor'
      d='M12.217 13.124a6.63 6.63 0 0 1-4.219 1.51 6.63 6.63 0 0 1-4.2-1.493l2.684-2.686a2.88 2.88 0 0 0 3.052-.014zm-6.67-6.658a2.87 2.87 0 0 0 .009 3.077l-2.682 2.682a6.6 6.6 0 0 1-1.525-4.227c0-1.6.569-3.07 1.515-4.216zm7.6-2.664a6.6 6.6 0 0 1 1.5 4.196 6.6 6.6 0 0 1-1.51 4.208l-2.685-2.685a2.86 2.86 0 0 0 .008-3.033zm-5.149-2.44c1.605 0 3.08.57 4.23 1.519l-2.68 2.682a2.88 2.88 0 0 0-3.078-.015L3.786 2.864a6.63 6.63 0 0 1 4.212-1.503'
    />
  </Svg>,
);
