import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * Snow icon component for React Native.
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
 * import { Snow } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Snow />
 *
 * @example
 * // With custom size and style
 * <Snow size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Snow} size="md">
 *   Click me
 * </Button>
 */
export const Snow = createIcon(
  'Snow',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M8 2v12M9.445 2.947 8 4.387 6.552 2.941m6.781 1.979L2.667 11.08m10.426-4.355-1.98-.533.527-1.98M2.902 9.273l1.973.527-.533 1.973M2.667 4.92l10.666 6.16M2.902 6.725l1.973-.533-.533-1.98m8.751 5.061-1.98.527.527 1.973m-5.085 1.274 1.44-1.447 1.44 1.44'
    />
  </Svg>,
);
