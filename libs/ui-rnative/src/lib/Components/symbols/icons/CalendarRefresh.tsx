import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * CalendarRefresh icon component for React Native.
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
 * import { CalendarRefresh } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <CalendarRefresh />
 *
 * @example
 * // With custom size and style
 * <CalendarRefresh size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={CalendarRefresh} size="md">
 *   Click me
 * </Button>
 */
export const CalendarRefresh = createIcon(
  'CalendarRefresh',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='m9.482 11.247-.578-.52-.581.52m4.095 1.828a2.26 2.26 0 0 1-1.278.396 2.28 2.28 0 0 1-2.237-2.728m4.1.162.556.52.56-.52m-4.074-1.828a2.26 2.26 0 0 1 1.278-.396 2.28 2.28 0 0 1 2.236 2.728M10 2v1.333M4.667 2v1.333M2 5.333h10.667m0 1.334V4c0-.737-.597-1.333-1.334-1.333h-8C2.597 2.667 2 3.263 2 4v7.333c0 .737.597 1.334 1.333 1.334h3.334m.683-4.918h-.006l-.007-.007v-.006m-2.64.013H4.69l-.006-.007v-.006m.013 2.46H4.69l-.006-.006v-.007'
    />
  </Svg>,
);
