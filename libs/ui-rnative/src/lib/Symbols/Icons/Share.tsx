import Svg, { Path } from 'react-native-svg';
import createIcon from '../../Components/Icon/createIcon';

/**
 * Share icon component for React Native.
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
 * import { Share } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Share />
 *
 * @example
 * // With custom size and style
 * <Share size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Share} size="md">
 *   Click me
 * </Button>
 */
export const Share = createIcon(
  'Share',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M5.333 6.667H4c-.737 0-1.333.596-1.333 1.333v4.667C2.667 13.403 3.263 14 4 14h8c.737 0 1.333-.597 1.333-1.333V8c0-.737-.596-1.333-1.333-1.333h-1.333M8 2v7.333M10 4 8 2 6 4'
    />
  </Svg>,
);
