import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * Label icon component for React Native.
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
 * import { Label } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Label />
 *
 * @example
 * // With custom size and style
 * <Label size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Label} size="md">
 *   Click me
 * </Button>
 */
export const Label = createIcon(
  'Label',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M5.542 5.173a.26.26 0 1 1-.367.366.26.26 0 0 1 .367-.366'
      clipRule='evenodd'
    />
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M4.83 2.017 6.728 2c.354-.003.694.137.945.387l5.936 5.938c.52.521.52 1.366 0 1.886l-3.396 3.398a1.333 1.333 0 0 1-1.887 0l-5.94-5.942A1.32 1.32 0 0 1 2 6.733V4.858c0-.35.14-.687.387-.934l1.52-1.52a1.32 1.32 0 0 1 .922-.387'
      clipRule='evenodd'
    />
  </Svg>,
);
