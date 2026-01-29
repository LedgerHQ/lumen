import { getFontSize, textFormatter } from '@ledgerhq/lumen-utils-shared';
import { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useStyleSheet } from '../../../styles';
import { Box } from '../Utility';
import { type AmountInputProps } from './types';

/**
 * AmountInput component for handling numeric input with currency display.
 * This is a controlled component - both `value` and `onChange` props are required.
 * The currency text can be positioned either on the left or right side of the input.
 */
export const AmountInput = ({
  lx = {},
  style,
  currencyText,
  currencyPosition = 'left',
  editable = true,
  maxIntegerLength = 9,
  maxDecimalLength = 9,
  allowDecimals = true,
  thousandsSeparator = true,
  value,
  onChangeText,
  isInvalid = false,
  ref,
  ...props
}: AmountInputProps) => {
  const inputRef = useRef<TextInput>(null);
  const inputValue = String(value);
  const [isFocused, setIsFocused] = useState(false);

  const translateX = useSharedValue(0);
  const animatedFontSize = useSharedValue(getFontSize(inputValue));
  const caretOpacity = useSharedValue(0);

  useImperativeHandle(ref, () => inputRef.current as TextInput, []);

  const styles = useStyles({
    hasValue: !!inputValue,
    isEditable: editable,
    isInvalid,
  });

  const animatedInputStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateX: translateX.value }],
      fontSize: animatedFontSize.value,
      letterSpacing: 0,
    }),
    [translateX, animatedFontSize],
  );

  const animatedCurrencyStyle = useAnimatedStyle(
    () => ({
      fontSize: animatedFontSize.value,
      letterSpacing: 0,
    }),
    [animatedFontSize],
  );

  const animatedCaretStyle = useAnimatedStyle(
    () => ({
      opacity: caretOpacity.value,
      height: animatedFontSize.value,
    }),
    [caretOpacity, animatedFontSize],
  );

  useEffect(() => {
    const newSize = getFontSize(inputValue);

    translateX.value = withSequence(
      withTiming(4, { duration: 0 }),
      withTiming(0, {
        duration: 250,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      }),
    );

    animatedFontSize.value = withTiming(newSize, {
      duration: 250,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });
  }, [inputValue, animatedFontSize, translateX]);

  useEffect(() => {
    if (isFocused && editable) {
      caretOpacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 150, easing: Easing.ease }),
          withTiming(1, { duration: 500 }),
          withTiming(0, { duration: 150, easing: Easing.ease }),
          withTiming(0, { duration: 500 }),
        ),
        -1,
        false,
      );
    } else {
      caretOpacity.value = 0;
    }
  }, [isFocused, editable, caretOpacity]);

  const handleChangeText = (text: string) => {
    const formatted = textFormatter(text, {
      allowDecimals,
      thousandsSeparator,
      maxIntegerLength,
      maxDecimalLength,
    });

    onChangeText(formatted);
  };

  const CurrencyText = currencyText ? (
    <Animated.Text style={[styles.currency, animatedCurrencyStyle]}>
      {currencyText}
    </Animated.Text>
  ) : null;

  const handlePress = () => {
    if (editable) {
      inputRef.current?.focus();
    }
  };

  return (
    <Box lx={lx} style={styles.container}>
      {/** hidden text input because of flickering issue */}
      <TextInput
        ref={inputRef}
        keyboardType='decimal-pad'
        editable={editable}
        value={inputValue}
        onChangeText={handleChangeText}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        style={styles.hiddenInput}
        {...props}
      />
      <Pressable
        onPress={handlePress}
        style={styles.pressable}
        accessibilityLabel={props.accessibilityLabel || 'Amount input'}
      >
        {currencyPosition === 'left' && CurrencyText}

        {/** display text that mirrors the hidden input's value */}
        <Animated.Text style={[styles.displayText, animatedInputStyle, style]}>
          {inputValue || '0'}
        </Animated.Text>

        {/** custom caret */}
        <Animated.View style={[styles.caret, animatedCaretStyle]} />

        {currencyPosition === 'right' && CurrencyText}
      </Pressable>
    </Box>
  );
};

const useStyles = ({
  hasValue,
  isEditable,
  isInvalid,
}: {
  hasValue: boolean;
  isEditable: boolean;
  isInvalid: boolean;
}) => {
  return useStyleSheet(
    (t) => ({
      container: {
        position: 'relative',
      },
      hiddenInput: {
        position: 'absolute',
        width: t.sizes.full,
        height: t.sizes.full,
        opacity: 0,
      },
      pressable: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      },
      displayText: StyleSheet.flatten([
        {
          height: t.sizes.s56,
          backgroundColor: 'transparent',
          color: t.colors.text.base,
          alignItems: 'flex-start',
          ...t.typographies.heading0SemiBold,
        },
        !hasValue && {
          color: t.colors.text.mutedSubtle,
        },
        !isEditable && {
          color: t.colors.text.disabled,
        },
        isInvalid && {
          color: t.colors.text.error,
        },
      ]),
      currency: StyleSheet.flatten([
        {
          color: t.colors.text.base,
          ...t.typographies.heading0SemiBold,
        },
        !hasValue && {
          color: t.colors.text.mutedSubtle,
        },
        !isEditable && {
          color: t.colors.text.disabled,
        },
        isInvalid && {
          color: t.colors.text.error,
        },
      ]),
      caret: {
        marginHorizontal: t.spacings.s2,
        width: t.sizes.s2,
        backgroundColor: t.colors.text.active,
      },
    }),
    [hasValue, isEditable, isInvalid],
  );
};

AmountInput.displayName = 'AmountInput';
