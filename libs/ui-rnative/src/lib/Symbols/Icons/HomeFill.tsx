import Svg, { Path } from 'react-native-svg';
import createIcon from '../../Components/Icon/createIcon';

/**
 * HomeFill icon component for React Native.
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
 * import { HomeFill } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <HomeFill />
 *
 * @example
 * // With custom size and style
 * <HomeFill size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={HomeFill} size="md">
 *   Click me
 * </Button>
 */
export const HomeFill = createIcon(
  'HomeFill',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      fill='currentColor'
      d='M7.714 1.416a.65.65 0 0 1 .658.052l6.667 4.666a.65.65 0 0 1-.745 1.065l-.31-.218V14a.65.65 0 0 1-.65.65h-2.67a.7.7 0 0 1-.7-.683l-.089-3.875a1.5 1.5 0 0 0-1.499-1.466h-.824a1.5 1.5 0 0 0-1.5 1.5v3.824a.7.7 0 0 1-.7.7H2.666a.65.65 0 0 1-.65-.65V6.98l-.31.218A.65.65 0 0 1 .96 6.134l6.667-4.666z'
    />
  </Svg>,
);
