import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * Craft icon component for React Native.
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
 * import { Craft } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Craft />
 *
 * @example
 * // With custom size and style
 * <Craft size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Craft} size="md">
 *   Click me
 * </Button>
 */
export const Craft = createIcon(
  'Craft',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M4 6.667 2.552 5.219A1.886 1.886 0 0 1 5.22 2.552L6.667 4M3.333 6 6 3.333m6 6 1.14 1.14c.185.186.312.423.364.681l.49 2.447a.333.333 0 0 1-.393.392l-2.447-.49a1.33 1.33 0 0 1-.681-.364L9.333 12m.748-7.576-.76-.76M8.53 6.644 7.436 5.551M6.31 8.195l-.76-.759m-.793 2.978L3.665 9.322M5.213 13.8a.684.684 0 0 1-.966 0L2.2 11.753a.684.684 0 0 1 0-.966L10.787 2.2a.684.684 0 0 1 .966 0L13.8 4.247c.267.267.267.7 0 .966z'
    />
  </Svg>,
);
