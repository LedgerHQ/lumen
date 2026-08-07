import Svg, { Path } from 'react-native-svg';
import createIcon from '../../internal/Icon/createIcon';

/**
 * Link icon component for React Native.
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
 * import { Link } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Link />
 *
 * @example
 * // With custom size and style
 * <Link size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Link} size="md">
 *   Click me
 * </Button>
 */
export const Link = createIcon(
  'Link',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='m9.417 11.508-.971.971a3.58 3.58 0 0 1-5.067 0 3.58 3.58 0 0 1 0-5.066l.974-.969M5.93 9.931l4.14-4.14M6.583 4.215l.971-.972a3.58 3.58 0 0 1 5.844 1.163 3.58 3.58 0 0 1-.777 3.904l-.974.969'
    />
  </Svg>,
);
