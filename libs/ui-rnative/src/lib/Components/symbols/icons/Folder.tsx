import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * Folder icon component for React Native.
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
 * import { Folder } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Folder />
 *
 * @example
 * // With custom size and style
 * <Folder size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Folder} size="md">
 *   Click me
 * </Button>
 */
export const Folder = createIcon(
  'Folder',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M14 6V4.667c0-.74-.6-1.334-1.333-1.334h-5.5m.96 1.927L7.193 3.4A1.34 1.34 0 0 0 6 2.66H3.32v-.007c-.74 0-1.333.594-1.333 1.334v8c0 .733.593 1.333 1.333 1.333h9.333c.734 0 1.334-.6 1.334-1.333v-6h-4.68c-.507 0-.974-.287-1.194-.74z'
    />
  </Svg>,
);
