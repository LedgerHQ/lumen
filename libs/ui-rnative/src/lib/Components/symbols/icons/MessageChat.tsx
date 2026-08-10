import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg';
import createIcon from '../Icon/createIcon';

/**
 * MessageChat icon component for React Native.
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
 * import { MessageChat } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <MessageChat />
 *
 * @example
 * // With custom size and style
 * <MessageChat size={40} color="warning" lx={{ marginTop: 's4' }} />
 *
 * @example
 * // Used within a Button component
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button icon={MessageChat} size="md">
 *   Click me
 * </Button>
 */
export const MessageChat = createIcon(
  'MessageChat',
  <Svg width={24} height={24} fill='currentColor' viewBox='0 0 16 16'>
    <G clipPath='url(#clip0_805_1619)'>
      <Path
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.3}
        d='M4.719 14.539c1.8 0 3.266-1.467 3.266-3.27A3.28 3.28 0 0 0 4.713 8a3.266 3.266 0 0 0-3.269 3.27m3.278 3.272c-.493 0-.96-.113-1.38-.307l-2.013.427.42-2.02c-.2-.42-.307-.893-.307-1.387m2.93-3.242a4.4 4.4 0 0 1-.374-1.773c0-2.68 2.393-4.827 5.333-4.827 2.934 0 5.334 2.147 5.334 4.827 0 1.58-.847 2.976-2.134 3.855 0 .5-.006 1.18-.006 1.893l-2.094-1.033q-.541.1-1.113.1c-.473 0-.933-.06-1.367-.167'
      />
    </G>
    <Defs>
      <ClipPath id='clip0_805_1619'>
        <Path fill='#fff' d='M0 0h16v16H0z' />
      </ClipPath>
    </Defs>
  </Svg>,
);
