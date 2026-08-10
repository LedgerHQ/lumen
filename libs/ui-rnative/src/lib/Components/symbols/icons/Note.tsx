import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * Note icon component for React Native.
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
 * import { Note } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Note />
 *
 * @example
 * // With custom size and style
 * <Note size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Note} size="md">
 *   Click me
 * </Button>
 */
export const Note = createIcon(
  'Note',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M4.667 8h6.666M4.667 5.333h6.666m-6.666 5.334H8M4.667 14h6.666A2.667 2.667 0 0 0 14 11.333V4.667A2.667 2.667 0 0 0 11.333 2H4.667A2.667 2.667 0 0 0 2 4.667v6.666A2.667 2.667 0 0 0 4.667 14'
    />
  </Svg>,
);
