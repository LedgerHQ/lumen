import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * ServerDatabaseFail icon component for React Native.
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
 * import { ServerDatabaseFail } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <ServerDatabaseFail />
 *
 * @example
 * // With custom size and style
 * <ServerDatabaseFail size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={ServerDatabaseFail} size="md">
 *   Click me
 * </Button>
 */
export const ServerDatabaseFail = createIcon(
  'ServerDatabaseFail',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M3.667 6.333A4.326 4.326 0 0 1 8 2a4.33 4.33 0 0 1 4.333 4.333m-8.666 0a4.333 4.333 0 1 0 8.667 0m-8.667 0h8.666m-5.333 6 2 2m-2 0 2-2m1.667 1h2.666m-10.666 0h2.666M7.118 2.51c-1.393 2.323-1.393 5.32 0 7.647.407.68 1.353.68 1.76 0 1.387-2.327 1.387-5.324 0-7.647a1.02 1.02 0 0 0-1.767 0z'
    />
  </Svg>,
);
