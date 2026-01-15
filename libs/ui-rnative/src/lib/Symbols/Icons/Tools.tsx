import Svg, { Path } from 'react-native-svg';
import createIcon from '../../Components/Icon/createIcon';

/**
 * Tools icon component for React Native.
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
 * import { Tools } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Tools />
 *
 * @example
 * // With custom size and style
 * <Tools size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Tools} size="md">
 *   Click me
 * </Button>
 */
export const Tools = createIcon(
  'Tools',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='m7.887 10 3.333 3.333a1.424 1.424 0 0 0 2 0 1.424 1.424 0 0 0 0-2L9.887 8M4.56 4.667 6.893 7m7.047-3.107a.14.14 0 0 1 .033.054 3.04 3.04 0 0 1-.76 3.04 3.05 3.05 0 0 1-3.08.74l-5.564 5.56c-.547.54-1.427.58-1.987.06a1.414 1.414 0 0 1-.04-2.04l5.587-5.594a3.04 3.04 0 0 1 .74-3.08c.82-.825 2-1.073 3.04-.76.02.007.04.014.053.034l.107.106c.046.047.046.134 0 .187l-1.762 1.753L11.853 5.5l1.754-1.76c.046-.053.133-.053.186 0l.107.107zM1.953 2.86 2.4 4.207a.66.66 0 0 0 .627.453h1.519V3.14a.67.67 0 0 0-.46-.633l-1.353-.453a.34.34 0 0 0-.347.08l-.38.374a.31.31 0 0 0-.08.34z'
    />
  </Svg>,
);
