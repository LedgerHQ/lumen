import Svg, { Path } from 'react-native-svg';
import createIcon from '../../internal/Icon/createIcon';

/**
 * DocumentCode icon component for React Native.
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
 * import { DocumentCode } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <DocumentCode />
 *
 * @example
 * // With custom size and style
 * <DocumentCode size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={DocumentCode} size="md">
 *   Click me
 * </Button>
 */
export const DocumentCode = createIcon(
  'DocumentCode',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='m4.667 6 1-1-1-1M4 11.333V10m9 4H3.333C2.593 14 2 13.4 2 12.667V12a.66.66 0 0 1 .667-.667h8.666c.367 0 .667.294.667.667v1c0 .547.447 1 1 1m0 0c.547 0 1-.453 1-1V3.333C14 2.593 13.4 2 12.667 2H10M3.667 2h2.666C7.253 2 8 2.746 8 3.667v2.666C8 7.253 7.254 8 6.333 8H3.667C2.747 8 2 7.254 2 6.333V3.667C2 2.747 2.746 2 3.667 2'
    />
  </Svg>,
);
