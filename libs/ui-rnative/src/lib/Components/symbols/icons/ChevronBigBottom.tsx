import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * ChevronBigBottom icon component for React Native.
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
 * import { ChevronBigBottom } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <ChevronBigBottom />
 *
 * @example
 * // With custom size and style
 * <ChevronBigBottom size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={ChevronBigBottom} size="md">
 *   Click me
 * </Button>
 */
export const ChevronBigBottom = createIcon(
  'ChevronBigBottom',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='m14 5-6 6-6-6'
    />
  </Svg>,
);
