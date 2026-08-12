import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * SettingsAlt2 icon component for React Native.
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
 * import { SettingsAlt2 } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <SettingsAlt2 />
 *
 * @example
 * // With custom size and style
 * <SettingsAlt2 size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={SettingsAlt2} size="md">
 *   Click me
 * </Button>
 */
export const SettingsAlt2 = createIcon(
  'SettingsAlt2',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M14 4.667h-2.04m-3.333 0H2m9.473-1.18a1.67 1.67 0 0 1 0 2.353 1.68 1.68 0 0 1-2.36 0 1.666 1.666 0 0 1 0-2.36 1.66 1.66 0 0 1 2.354 0m-4.094 7.853H14m-12 0h2.04m2.84-1.17a1.67 1.67 0 0 1 0 2.354 1.68 1.68 0 0 1-2.36 0 1.666 1.666 0 0 1 0-2.36 1.66 1.66 0 0 1 2.353 0'
    />
  </Svg>,
);
