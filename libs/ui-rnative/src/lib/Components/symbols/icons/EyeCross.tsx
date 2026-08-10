import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * EyeCross icon component for React Native.
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
 * import { EyeCross } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <EyeCross />
 *
 * @example
 * // With custom size and style
 * <EyeCross size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={EyeCross} size="md">
 *   Click me
 * </Button>
 */
export const EyeCross = createIcon(
  'EyeCross',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M9.7 9.033a2.014 2.014 0 0 1-2.747.7 2.01 2.01 0 0 1-.707-2.746c.167-.294.407-.534.7-.707m5.047 5.047a6.62 6.62 0 0 1-4 1.333A6.3 6.3 0 0 1 2.29 9.267h-.003c-.4-.807-.4-1.747 0-2.554A5.9 5.9 0 0 1 4.8 4.133m8.813 5.287c.027-.053.06-.1.087-.153a2.91 2.91 0 0 0 0-2.554A6.29 6.29 0 0 0 7.993 3.32c-.154 0-.3.02-.447.027M14 13.333 2.667 2'
    />
  </Svg>,
);
