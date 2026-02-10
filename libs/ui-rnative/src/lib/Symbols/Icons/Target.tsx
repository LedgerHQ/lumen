import Svg, { Path } from 'react-native-svg';
import createIcon from '../../Components/Icon/createIcon';

/**
 * Target icon component for React Native.
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
 * import { Target } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Target />
 *
 * @example
 * // With custom size and style
 * <Target size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Target} size="md">
 *   Click me
 * </Button>
 */
export const Target = createIcon(
  'Target',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M13.818 8.316a5.684 5.684 0 1 1-5.685-5.684m3.158 5.684a3.158 3.158 0 1 1-3.158-3.158m2.53.629L8.136 8.313M12.555 2 10.66 3.895v1.894h1.895l1.894-1.894-1.263-.632z'
    />
  </Svg>,
);
