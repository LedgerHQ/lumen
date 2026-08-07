import Svg, { Path } from 'react-native-svg';
import createIcon from '../../internal/Icon/createIcon';

/**
 * Mobile icon component for React Native.
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
 * import { Mobile } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Mobile />
 *
 * @example
 * // With custom size and style
 * <Mobile size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Mobile} size="md">
 *   Click me
 * </Button>
 */
export const Mobile = createIcon(
  'Mobile',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M6.333 2v1.2a.37.37 0 0 0 .334.4h2.666a.38.38 0 0 0 .333-.4V2m-3 10h2.667m1.334 2H5.333C4.593 14 4 13.4 4 12.667V3.333C4 2.593 4.593 2 5.333 2h5.334C11.4 2 12 2.593 12 3.333v9.334C12 13.4 11.4 14 10.667 14'
    />
  </Svg>,
);
