import { Text as RNText } from 'react-native';
import { createStyledText } from '../../../../styles';

/**
 * Text - A typography component with typography support and token-constrained style props.
 *
 * Text is a wrapper around React Native's Text that accepts a `typography` prop for
 * typography presets, plus design token-based style props for colors, spacing, etc.
 *
 * @see {@link https://ldls-react-native.vercel.app/?path=/docs/primitives-text--docs Storybook}
 *
 * @example
 * ```tsx
 * import { Text } from '@ledgerhq/lumen-ui-rnative';
 *
 * // Basic usage with typography typography
 * <Text typography='body1'>Hello World</Text>
 *
 * // With custom color
 * <Text typography='heading3SemiBold' lx={{ color: 'muted' }}>
 *   Subtitle
 * </Text>
 *
 * // With spacing
 * <Text typography='body2' lx={{ marginTop: 's8', color: 'base' }}>
 *   Description text
 * </Text>
 *
 * // Style prop for complete override
 * <Text
 *  typography='body1'
 *  lx={{ marginTop: 's8' }}
 *  style={{ letterSpacing: 127 }}
 * />
 * ```
 */
export const Text = createStyledText(RNText);
