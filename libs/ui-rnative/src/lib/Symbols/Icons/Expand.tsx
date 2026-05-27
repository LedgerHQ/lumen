import Svg, { Path } from 'react-native-svg';
import createIcon from '../../Components/Icon/createIcon';

/**
 * Expand icon component for React Native.
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
 * import { Expand } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Expand />
 *
 * @example
 * // With custom size and style
 * <Expand size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Expand} size="md">
 *   Click me
 * </Button>
 */
export const Expand = createIcon(
  'Expand',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M14 4.667V2h-2.667M14 2l-4 4M2.667 7.333V4c0-.737.596-1.333 1.333-1.333h3.333M2 11.333V14h2.667M2 14l4-4m7.333-1.333V12c0 .737-.596 1.333-1.333 1.333H8'
    />
  </Svg>,
);
