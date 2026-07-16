import Svg, { Path } from 'react-native-svg';
import createIcon from '../../Components/Icon/createIcon';

/**
 * GameControler icon component for React Native.
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
 * import { GameControler } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <GameControler />
 *
 * @example
 * // With custom size and style
 * <GameControler size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={GameControler} size="md">
 *   Click me
 * </Button>
 */
export const GameControler = createIcon(
  'GameControler',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='m10.664 3.342-.512 1.535a.67.67 0 0 1-.633.456H6.48a.67.67 0 0 1-.632-.456l-.512-1.535M5.84 10 4.8 11.753a1.864 1.864 0 0 1-3.426-1.337l.94-4.44a3.33 3.33 0 0 1 3.262-2.643h4.846a3.33 3.33 0 0 1 3.261 2.642l.941 4.441a1.864 1.864 0 0 1-3.427 1.337L10.16 10z'
    />
  </Svg>,
);
