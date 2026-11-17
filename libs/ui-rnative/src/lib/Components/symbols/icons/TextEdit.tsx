import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * TextEdit icon component for React Native.
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
 * import { TextEdit } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <TextEdit />
 *
 * @example
 * // With custom size and style
 * <TextEdit size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={TextEdit} size="md">
 *   Click me
 * </Button>
 */
export const TextEdit = createIcon(
  'TextEdit',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M5.333 4H2v1.333M5.333 4h3.334v1.333M5.333 4v8m0 0h1.334m-1.334 0H4m8.667-10v12m0-12h-1.334m1.334 0H14m-1.333 12H14m-1.333 0h-1.334'
    />
  </Svg>,
);
