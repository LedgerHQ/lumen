import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * Hourglass icon component for React Native.
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
 * import { Hourglass } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Hourglass />
 *
 * @example
 * // With custom size and style
 * <Hourglass size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Hourglass} size="md">
 *   Click me
 * </Button>
 */
export const Hourglass = createIcon(
  'Hourglass',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M6.667 12h2.666M11.32 2H4.681a.667.667 0 0 0-.667.667v1.585c0 .28.089.555.253.782L6.414 8l-2.147 2.966a1.33 1.33 0 0 0-.253.782v1.585c0 .368.299.667.667.667h6.638a.667.667 0 0 0 .666-.667v-1.561c0-.296-.098-.583-.28-.817L9.414 8l2.292-2.955c.181-.234.28-.522.28-.818v-1.56A.667.667 0 0 0 11.319 2'
    />
  </Svg>,
);
