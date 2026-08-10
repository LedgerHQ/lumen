import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * Telegram icon component for React Native.
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
 * import { Telegram } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Telegram />
 *
 * @example
 * // With custom size and style
 * <Telegram size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Telegram} size="md">
 *   Click me
 * </Button>
 */
export const Telegram = createIcon(
  'Telegram',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      fill='currentColor'
      fillRule='evenodd'
      d='M1.962 7.2Q7.6 4.768 9.48 3.99c3.58-1.475 4.324-1.731 4.81-1.74.106-.002.344.024.499.149.13.105.166.246.183.346s.039.326.022.503c-.194 2.02-1.034 6.923-1.46 9.186-.182.958-.537 1.279-.882 1.31-.748.069-1.317-.49-2.042-.961-1.135-.737-1.776-1.196-2.877-1.916-1.273-.831-.448-1.288.278-2.035.19-.195 3.488-3.169 3.552-3.439.008-.033.015-.16-.06-.226s-.187-.043-.267-.025q-.17.038-5.438 3.562-.771.525-1.398.512c-.46-.01-1.345-.258-2.004-.47-.807-.26-1.449-.398-1.393-.84q.045-.345.96-.705'
      clipRule='evenodd'
    />
  </Svg>,
);
