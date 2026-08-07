import Svg, { Path } from 'react-native-svg';
import createIcon from '../../internal/Icon/createIcon';

/**
 * Planet icon component for React Native.
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
 * import { Planet } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Planet />
 *
 * @example
 * // With custom size and style
 * <Planet size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Planet} size="md">
 *   Click me
 * </Button>
 */
export const Planet = createIcon(
  'Planet',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M5.153 8a2.844 2.844 0 0 1 2.84-2.847m7.2-1.313c.76 1.32-1.84 4.26-5.82 6.553s-7.826 3.08-8.586 1.754m.013.013c-.467-.807.313-2.207 1.887-3.7m8.373-4.827c2.073-.62 3.673-.593 4.14.207M8 2.667a5.333 5.333 0 1 0 0 10.666A5.333 5.333 0 0 0 8 2.667'
    />
  </Svg>,
);
