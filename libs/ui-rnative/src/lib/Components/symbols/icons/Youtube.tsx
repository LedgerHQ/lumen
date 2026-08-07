import Svg, { Path } from 'react-native-svg';
import createIcon from '../../internal/Icon/createIcon';

/**
 * Youtube icon component for React Native.
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
 * import { Youtube } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Youtube />
 *
 * @example
 * // With custom size and style
 * <Youtube size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Youtube} size="md">
 *   Click me
 * </Button>
 */
export const Youtube = createIcon(
  'Youtube',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      fill='currentColor'
      fillRule='evenodd'
      d='M13.47 3.299a1.77 1.77 0 0 1 1.238 1.263C15 5.675 15 8 15 8s0 2.325-.293 3.438a1.77 1.77 0 0 1-1.238 1.263C12.38 13 8 13 8 13s-4.378 0-5.47-.299a1.77 1.77 0 0 1-1.237-1.263C1 10.325 1 8 1 8s0-2.325.293-3.438A1.77 1.77 0 0 1 2.53 3.299C3.622 3 8 3 8 3s4.378 0 5.47.299M10.239 8 6.6 5.857v4.286z'
      clipRule='evenodd'
    />
  </Svg>,
);
