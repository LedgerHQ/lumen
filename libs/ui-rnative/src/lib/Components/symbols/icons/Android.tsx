import Svg, { Path } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * Android icon component for React Native.
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
 * import { Android } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Android />
 *
 * @example
 * // With custom size and style
 * <Android size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={Android} size="md">
 *   Click me
 * </Button>
 */
export const Android = createIcon(
  'Android',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <Path
      fill='currentColor'
      d='M11.922 11.35a.9.9 0 0 1-.273.668.9.9 0 0 1-.658.272h-.641v1.94a.85.85 0 0 1-.257.625.85.85 0 0 1-.624.256.85.85 0 0 1-.624-.256.85.85 0 0 1-.256-.624v-1.94H7.41v1.94a.85.85 0 0 1-.255.624.85.85 0 0 1-.624.256.84.84 0 0 1-.616-.256.85.85 0 0 1-.257-.624l-.008-1.94h-.632a.9.9 0 0 1-.667-.274.9.9 0 0 1-.274-.666V5.658h7.846zM2.863 5.496a.84.84 0 0 1 .616.256.84.84 0 0 1 .256.615v3.676a.86.86 0 0 1-.252.624.84.84 0 0 1-.62.256.85.85 0 0 1-.623-.256.85.85 0 0 1-.257-.624V6.367a.84.84 0 0 1 .256-.615.85.85 0 0 1 .624-.256M13.137 5.496q.367 0 .623.252t.257.62v3.675a.85.85 0 0 1-.257.624.85.85 0 0 1-.623.256.84.84 0 0 1-.616-.256.85.85 0 0 1-.256-.624V6.367q0-.366.256-.619a.85.85 0 0 1 .616-.252'
    />
    <Path
      fill='currentColor'
      fillRule='evenodd'
      d='M10.504.906q.102.06.043.171l-.607 1.12q.915.47 1.462 1.312.547.841.547 1.842H4.041q0-1 .548-1.842a3.75 3.75 0 0 1 1.47-1.313l-.607-1.119q-.06-.11.042-.17.111-.052.171.05l.615 1.129a4.2 4.2 0 0 1 1.72-.36q.905 0 1.717.36l.615-1.129q.06-.102.171-.05m-4.307 2.35a.33.33 0 0 0-.325.333q0 .138.093.235.094.099.232.099a.32.32 0 0 0 .234-.099.32.32 0 0 0 .099-.234.32.32 0 0 0-.1-.235.32.32 0 0 0-.233-.098m3.606 0a.32.32 0 0 0-.235.099.32.32 0 0 0-.098.235.32.32 0 0 0 .098.234.32.32 0 0 0 .235.099.3.3 0 0 0 .23-.099.33.33 0 0 0 .095-.234.33.33 0 0 0-.325-.333'
      clipRule='evenodd'
    />
  </Svg>,
);
