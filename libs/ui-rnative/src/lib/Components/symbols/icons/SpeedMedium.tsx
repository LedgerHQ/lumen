import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * SpeedMedium icon component for React Native.
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
 * import { SpeedMedium } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <SpeedMedium />
 *
 * @example
 * // With custom size and style
 * <SpeedMedium size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={SpeedMedium} size="md">
 *   Click me
 * </Button>
 */
export const SpeedMedium = createIcon(
  'SpeedMedium',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M2.525 6.207a5.95 5.95 0 0 0 1.693 7.12m7.548-.008a5.99 5.99 0 0 0 2.227-4.667A6.01 6.01 0 0 0 10 3.002M4.213 13.32a5.99 5.99 0 0 1-2.227-4.667 6.01 6.01 0 0 1 3.992-5.65m2.023 4.331V2.666m-.023 4.66a1.333 1.333 0 1 1 0 2.667 1.333 1.333 0 0 1 0-2.666'
    />
  </Svg>,
);
