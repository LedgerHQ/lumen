import Svg, { Path } from 'react-native-svg';
import createIcon from '../../internal/Icon/createIcon';

/**
 * PlusCircleFill icon component for React Native.
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
 * import { PlusCircleFill } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <PlusCircleFill />
 *
 * @example
 * // With custom size and style
 * <PlusCircleFill size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={PlusCircleFill} size="md">
 *   Click me
 * </Button>
 */
export const PlusCircleFill = createIcon(
  'PlusCircleFill',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      fill='currentColor'
      d='M8 1.35a6.65 6.65 0 0 1 0 13.3A6.646 6.646 0 0 1 1.35 8c0-3.679 2.978-6.65 6.65-6.65m0 3.333a.65.65 0 0 0-.65.65V7.35H5.334a.65.65 0 0 0 0 1.3H7.35v2.016a.65.65 0 0 0 1.3 0V8.65h2.016a.65.65 0 1 0 0-1.3H8.65V5.333a.65.65 0 0 0-.65-.65'
    />
  </Svg>,
);
