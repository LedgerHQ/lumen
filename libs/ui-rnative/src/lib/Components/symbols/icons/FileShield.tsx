import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * FileShield icon component for React Native.
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
 * import { FileShield } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <FileShield />
 *
 * @example
 * // With custom size and style
 * <FileShield size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={FileShield} size="md">
 *   Click me
 * </Button>
 */
export const FileShield = createIcon(
  'FileShield',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M2.667 6V3.333C2.667 2.597 3.264 2 4 2h8.667C13.403 2 14 2.597 14 3.333v9.334c0 .736-.597 1.333-1.333 1.333H8m3.333-8.667h-6m6 2.667H8.667m2.666 2.667H10M6.667 9.529v1.83c0 1.214-1.441 2.127-2.206 2.527a.99.99 0 0 1-.921 0c-.764-.4-2.207-1.314-2.207-2.526V9.529a.336.336 0 0 1 .318-.33 3.8 3.8 0 0 0 1.958-.736.65.65 0 0 1 .782 0c.571.424 1.25.679 1.958.736a.34.34 0 0 1 .318.33'
    />
  </Svg>,
);
