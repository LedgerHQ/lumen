import Svg, { Path } from 'react-native-svg';
import createIcon from '../../internal/Icon/createIcon';

/**
 * Dollar icon component for React Native.
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
 * import { Dollar } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Dollar />
 *
 * @example
 * // With custom size and style
 * <Dollar size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Dollar} size="md">
 *   Click me
 * </Button>
 */
export const Dollar = createIcon(
  'Dollar',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M8 5v.667M8 11v-.667M6.567 9.5c.26.54.826.867 1.426.833.726.08 1.393-.44 1.5-1.166 0-.507-.36-.94-.854-1.04L7.333 7.86c-.5-.1-.854-.533-.854-1.04.1-.733.767-1.253 1.5-1.167.6-.04 1.16.287 1.427.834M8 1.66a6.333 6.333 0 1 0 0 12.667A6.333 6.333 0 0 0 8 1.66'
    />
  </Svg>,
);
