import Svg, { Path } from 'react-native-svg';
import createIcon from '../../internal/Icon/createIcon';

/**
 * CoinsEye icon component for React Native.
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
 * import { CoinsEye } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <CoinsEye />
 *
 * @example
 * // With custom size and style
 * <CoinsEye size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={CoinsEye} size="md">
 *   Click me
 * </Button>
 */
export const CoinsEye = createIcon(
  'CoinsEye',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M8 14.333A6.333 6.333 0 1 1 14.333 8M6.955 6.932a1.865 1.865 0 1 1 3.694.512 1.88 1.88 0 0 1-1.593 1.589m3.53 3.234c.033.034.033.094 0 .134a.11.11 0 0 1-.14 0 .097.097 0 0 1 0-.14c.033-.04.093-.04.133 0M7.201 6.932a1.866 1.866 0 1 0 0 3.732 1.866 1.866 0 0 0 0-3.732m2.972 5.861a.83.83 0 0 1 0-.92c.56-.86 1.454-1.546 2.342-1.546.887 0 1.774.68 2.34 1.54.18.273.18.64 0 .92-.566.854-1.46 1.54-2.346 1.54-.894 0-1.78-.687-2.342-1.54z'
    />
  </Svg>,
);
