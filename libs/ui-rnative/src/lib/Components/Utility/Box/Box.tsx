import { View } from 'react-native';
import { createStyledView } from '../../../../styles';

/**
 * Box - A layout primitive component with token-constrained style props.
 *
 * Box is a View wrapper that accepts design token-based style props directly,
 * providing type-safe styling with autocomplete for spacing, sizes, colors, etc.
 *
 * @see {@link https://ldls-react-native.vercel.app/?path=/docs/primitives-box--docs Storybook}
 *
 * @example
 * ```tsx
 * import { Box } from '@ledgerhq/lumen-ui-rnative';
 *
 * // Basic usage with token props
 * <Box lx={{ width: 's400', marginTop: 's4', gap: 's12', alignItems: 'center' }}>
 *   <Text>Content</Text>
 * </Box>
 *
 * // With background and border
 * <Box
 *   lx={{
 *    padding: 's16',
 *    backgroundColor: 'surface',
 *    borderRadius: 'md',
 *    borderColor: 'muted',
 *    borderWidth: 1
 *   }}
 * >
 *   <Text>Card content</Text>
 * </Box>
 *
 * // style prop for complete override
 * <Box lx={{ marginTop: 's4' }} style={{ width: 127 }} />
 * ```
 */
export const Box = createStyledView(View);
