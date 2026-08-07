import Svg, { Path } from 'react-native-svg';
import createIcon from '../../internal/Icon/createIcon';

/**
 * Information icon component for React Native.
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
 * import { Information } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Information />
 *
 * @example
 * // With custom size and style
 * <Information size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Information} size="md">
 *   Click me
 * </Button>
 */
export const Information = createIcon(
  'Information',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M7.993 5.333a.165.165 0 0 0-.166.167.17.17 0 0 0 .166.167c.087 0 .167-.08.167-.167a.17.17 0 0 0-.173-.167M8 8v3.333M8 14c-3.32 0-6-2.686-6-6 0-3.32 2.686-6 6-6a6 6 0 1 1 0 12'
    />
  </Svg>,
);
