import Svg, { Path } from 'react-native-svg';
import createIcon from '../../Components/Icon/createIcon';

/**
 * Lightbulb icon component for React Native.
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
 * import { Lightbulb } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Lightbulb />
 *
 * @example
 * // With custom size and style
 * <Lightbulb size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Lightbulb} size="md">
 *   Click me
 * </Button>
 */
export const Lightbulb = createIcon(
  'Lightbulb',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 24 24'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.5}
      d='M15 15.19H9M20 5l1.19-1.19M4 15l-1.19 1.19M5 4 3.81 2.81M20 15l1.19 1.19M21 10h1.69M1.31 10H3m6 8h5.87m-6.33-3.104c-1.78-1.26-2.85-3.45-2.47-5.86.4-2.607 2.57-4.688 5.2-4.995a5.996 5.996 0 0 1 6.725 5.95c0 2.02-1.01 3.81-2.55 4.898-.28.19-.46.49-.46.83v2.76a2.5 2.5 0 0 1-2.5 2.5h-1c-1.39 0-2.5-1.12-2.5-2.5v-2.763c0-.35-.19-.65-.46-.85z'
    />
  </Svg>,
);
