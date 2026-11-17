import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * BadgeVerified icon component for React Native.
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
 * import { BadgeVerified } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <BadgeVerified />
 *
 * @example
 * // With custom size and style
 * <BadgeVerified size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={BadgeVerified} size="md">
 *   Click me
 * </Button>
 */
export const BadgeVerified = createIcon(
  'BadgeVerified',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M10 7 7.5 9.5 6 8m-.115 4.397H4.23c-.374 0-.674-.264-.674-.637V10.1a.66.66 0 0 0-.2-.473L2.184 8.453a.66.66 0 0 1 0-.946l1.18-1.187c.113-.12.18-.28.18-.447V4.2c0-.373.293-.673.667-.673h1.653a.64.64 0 0 0 .467-.2l1.166-1.174a.65.65 0 0 1 .94 0L9.604 3.32c.12.12.293.193.467.193h1.653c.367 0 .667.294.667.667v1.653c0 .178.066.347.193.467l1.167 1.167c.26.26.26.68 0 .94l-1.174 1.166a.65.65 0 0 0-.2.467v1.653c0 .367-.3.704-.673.704h-1.66c-.177 0-.353.03-.473.156L8.397 13.72a.67.67 0 0 1-.946 0l-1.174-1.173c-.126-.134-.219-.15-.392-.15'
    />
  </Svg>,
);
