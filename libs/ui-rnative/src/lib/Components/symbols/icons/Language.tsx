import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * Language icon component for React Native.
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
 * import { Language } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Language />
 *
 * @example
 * // With custom size and style
 * <Language size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Language} size="md">
 *   Click me
 * </Button>
 */
export const Language = createIcon(
  'Language',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M5 2.667v2m8.667 8.666-2.667-6-2.667 6M8.927 12h4.146m-10.74-2c2.73-.22 5.118-2.607 5.334-5.333H2.334M7.667 10C5.96 9.86 4.468 8.367 4.333 6.667'
    />
  </Svg>,
);
