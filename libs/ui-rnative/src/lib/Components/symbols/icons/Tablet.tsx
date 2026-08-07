import Svg, { Path } from 'react-native-svg';
import createIcon from '../../internal/Icon/createIcon';

/**
 * Tablet icon component for React Native.
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
 * import { Tablet } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Tablet />
 *
 * @example
 * // With custom size and style
 * <Tablet size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Tablet} size="md">
 *   Click me
 * </Button>
 */
export const Tablet = createIcon(
  'Tablet',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M8 11.917a.085.085 0 0 0-.087.083c0 .04.033.083.083.083.04 0 .083-.04.083-.083a.085.085 0 0 0-.086-.083m4.674.583v-9c0-.833-.674-1.5-1.5-1.5H4.833c-.833 0-1.5.667-1.5 1.5v9c0 .827.667 1.5 1.5 1.5h6.334c.826 0 1.5-.673 1.5-1.5'
    />
  </Svg>,
);
