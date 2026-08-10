import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * Twitter icon component for React Native.
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
 * import { Twitter } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Twitter />
 *
 * @example
 * // With custom size and style
 * <Twitter size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Twitter} size="md">
 *   Click me
 * </Button>
 */
export const Twitter = createIcon(
  'Twitter',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      fill='currentColor'
      d='M9.332 6.928 14.544 1h-1.235L8.783 6.147 5.17 1H1l5.466 7.784L1 15h1.235l4.78-5.436L10.83 15H15zM7.64 8.852l-.554-.775L2.68 1.91h1.897l3.556 4.977.554.775 4.622 6.47h-1.897z'
    />
  </Svg>,
);
