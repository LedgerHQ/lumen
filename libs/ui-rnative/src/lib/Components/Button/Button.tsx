import { BaseButton } from './BaseButton';
import { ButtonProps } from './types';

/**
 * A customizable button component that supports various appearances, sizes, full-width mode, loading states, and optional icons.
 *
 * When in loading state, it displays a spinner. If an icon is provided without children, it renders as an icon-only button.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/react-native_action-button--docs Storybook}
 * @see {@link https://ldls.vercel.app/?path=/docs/react-native_action-button--docs#dos-and-donts Guidelines}
 *
 * @example
 * // Basic primary button
 * import { Button } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Button appearance="base" size="md" onPress={() => console.log('Clicked!')}>
 *   Click Me
 * </Button>
 *
 * // Full-width button with lx props
 * <Button appearance="accent" isFull={true} lx={{ marginTop: 's16' }}>
 *   Submit
 * </Button>
 */
export const Button = (props: ButtonProps) => {
  return <BaseButton {...props} />;
};
Button.displayName = 'Button';
