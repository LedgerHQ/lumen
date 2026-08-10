import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * AlarmClock icon component for React Native.
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
 * import { AlarmClock } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <AlarmClock />
 *
 * @example
 * // With custom size and style
 * <AlarmClock size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={AlarmClock} size="md">
 *   Click me
 * </Button>
 */
export const AlarmClock = createIcon(
  'AlarmClock',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M3.113 11.473c.39.546.868 1.024 1.414 1.414M2.09 7A6 6 0 0 0 2 8c0 .341.035.674.09 1m1.023-4.473a6 6 0 0 1 1.414-1.414M7 13.91c.326.055.659.09 1 .09A6 6 0 1 0 8 2a6 6 0 0 0-1 .09m3.667 4.577L7.333 10l-2-2'
    />
  </Svg>,
);
