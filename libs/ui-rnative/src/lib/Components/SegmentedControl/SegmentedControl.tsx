import { useDisabledContext } from '@ledgerhq/lumen-utils-shared';
import { LayoutChangeEvent } from 'react-native';
import Animated from 'react-native-reanimated';
import { useStyleSheet } from '../../../styles';
import type { LumenTextStyle, LumenTypographyTokenName } from '../../../styles';
import { Box, Pressable, Text } from '../Utility';
import {
  SegmentedControlContextProvider,
  useSegmentedControlContext,
} from './SegmentedControlContext';
import type {
  SegmentedControlButtonProps,
  SegmentedControlProps,
} from './types';
import {
  usePillLayout,
  useSegmentedControlSelectedIndex,
} from './usePillLayout';

export function SegmentedControlButton({
  value,
  children,
  icon: Icon,
  onPress,
  ...props
}: SegmentedControlButtonProps) {
  const {
    selectedValue,
    onSelectedChange,
    disabled,
    tabLayout,
    registerButtonLayout,
  } = useSegmentedControlContext();
  const selected = selectedValue === value;
  const styles = useButtonStyles({ selected, disabled, tabLayout });

  function handlePress() {
    if (!disabled) {
      onSelectedChange(value);
      onPress?.();
    }
  }

  function handleLayout(e: LayoutChangeEvent) {
    if (tabLayout === 'fit') {
      const { x, width } = e.nativeEvent.layout;
      registerButtonLayout(value, { x, width });
    }
  }

  return (
    <Pressable
      onPress={handlePress}
      onLayout={handleLayout}
      disabled={disabled}
      accessibilityState={{ selected, disabled }}
      style={styles.button}
      {...props}
    >
      <Box style={styles.content}>
        {Icon && (
          <Box style={styles.iconWrap}>
            <Icon size={16} color={styles.textColor} />
          </Box>
        )}
        <Text
          typography={styles.typography}
          lx={{ color: styles.textColor }}
          style={styles.label}
          numberOfLines={1}
        >
          {children}
        </Text>
      </Box>
    </Pressable>
  );
}

function useButtonStyles({
  selected,
  disabled,
  tabLayout,
}: {
  selected: boolean;
  disabled?: boolean;
  tabLayout: 'fit' | 'fixed';
}) {
  const styles = useStyleSheet(
    (t) => ({
      button: {
        flex: tabLayout === 'fixed' ? 1 : undefined,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: t.spacings.s16,
        paddingVertical: t.spacings.s8,
        borderRadius: t.borderRadius.full,
        zIndex: 1,
      },
      content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: t.spacings.s8,
      },
      label: {
        textAlign: 'center',
        includeFontPadding: false,
        flexShrink: 1,
      },
      iconWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        flexShrink: 0,
      },
    }),
    [tabLayout],
  );
  const typography: LumenTypographyTokenName = selected
    ? 'body2SemiBold'
    : 'body2';
  const textColor: LumenTextStyle['color'] =
    selected && !disabled ? 'base' : 'muted';
  return { ...styles, typography, textColor };
}

export function SegmentedControl({
  selectedValue,
  onSelectedChange,
  accessibilityLabel,
  children,
  disabled: disabledProp,
  appearance = 'background',
  tabLayout = 'fixed',
  ...props
}: SegmentedControlProps) {
  const disabled = useDisabledContext({
    consumerName: 'SegmentedControl',
    mergeWith: { disabled: disabledProp },
  });
  const styles = useRootStyles({
    disabled: Boolean(disabled),
    appearance,
    tabLayout,
  });
  const selectedIndex = useSegmentedControlSelectedIndex(
    selectedValue,
    children,
  );
  const { onLayout, animatedPillStyle, registerButtonLayout } = usePillLayout({
    selectedIndex,
    selectedValue,
    children,
    tabLayout,
  });

  return (
    <SegmentedControlContextProvider
      value={{
        selectedValue,
        onSelectedChange,
        disabled,
        tabLayout,
        registerButtonLayout,
      }}
    >
      <Box
        accessibilityRole='radiogroup'
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled }}
        onLayout={onLayout}
        style={styles.container}
        {...props}
      >
        {children}
        <Animated.View
          style={[styles.pill, animatedPillStyle]}
          pointerEvents='none'
        />
      </Box>
    </SegmentedControlContextProvider>
  );
}

function useRootStyles({
  disabled,
  appearance,
  tabLayout,
}: {
  disabled: boolean;
  appearance: 'background' | 'no-background';
  tabLayout: 'fit' | 'fixed';
}) {
  return useStyleSheet(
    (t) => ({
      container: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
        ...(tabLayout === 'fixed'
          ? { width: '100%' }
          : { alignSelf: 'flex-start' }),
        borderRadius: t.borderRadius.md,
        backgroundColor:
          appearance === 'background' ? t.colors.bg.surface : 'transparent',
      },
      pill: {
        position: 'absolute',
        top: 0,
        left: 0,
        borderRadius: t.borderRadius.sm,
        backgroundColor: disabled
          ? t.colors.bg.baseTransparentPressed
          : t.colors.bg.mutedTransparent,
        zIndex: 0,
      },
    }),
    [disabled, appearance, tabLayout],
  );
}
