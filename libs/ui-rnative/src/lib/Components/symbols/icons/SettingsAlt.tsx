import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * SettingsAlt icon component for React Native.
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
 * import { SettingsAlt } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <SettingsAlt />
 *
 * @example
 * // With custom size and style
 * <SettingsAlt size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={SettingsAlt} size="md">
 *   Click me
 * </Button>
 */
export const SettingsAlt = createIcon(
  'SettingsAlt',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M12 3.333h2m-12 0h5.333M8.667 8H14M2 8h2m8 4.667h2m-12 0h5.333m4.276-10.28c.52.52.52 1.36 0 1.88-.526.52-1.366.52-1.886 0a1.324 1.324 0 0 1 0-1.887 1.316 1.316 0 0 1 1.88 0m-5.33 4.677c.52.52.52 1.36 0 1.88-.526.52-1.366.52-1.886 0a1.324 1.324 0 0 1 0-1.886 1.316 1.316 0 0 1 1.88 0m5.342 4.673c.52.52.52 1.36 0 1.88-.526.52-1.366.52-1.886 0a1.324 1.324 0 0 1 0-1.887 1.316 1.316 0 0 1 1.88 0'
    />
  </Svg>,
);
