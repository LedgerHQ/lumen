import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * DeleteCircleFill icon component for React Native.
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
 * import { DeleteCircleFill } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <DeleteCircleFill />
 *
 * @example
 * // With custom size and style
 * <DeleteCircleFill size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={DeleteCircleFill} size="md">
 *   Click me
 * </Button>
 */
export const DeleteCircleFill = createIcon(
  'DeleteCircleFill',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      fill='currentColor'
      fillRule='evenodd'
      d='M1.5 8c0-3.596 2.91-6.5 6.5-6.5a6.5 6.5 0 1 1 0 13c-3.596 0-6.5-2.91-6.5-6.5m4.967-2.24a.5.5 0 0 0-.707.707L7.293 8 5.76 9.533a.5.5 0 0 0 .707.707L8 8.707l1.533 1.533a.5.5 0 0 0 .707-.707L8.707 8l1.533-1.533a.5.5 0 0 0-.707-.707L8 7.293z'
      clipRule='evenodd'
    />
  </Svg>,
);
