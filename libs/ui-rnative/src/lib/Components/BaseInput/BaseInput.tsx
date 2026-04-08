import {
  DisabledProvider,
  useDisabledContext,
} from '@ledgerhq/lumen-utils-shared';
import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, {
  interpolate,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  cancelAnimation,
} from 'react-native-reanimated';
import { useCommonTranslation } from '../../../i18n';
import { LumenStyleSheetTheme, useStyleSheet, useTheme } from '../../../styles';
import { useTimingConfig } from '../../Animations/useTimingConfig';
import { DeleteCircleFill } from '../../Symbols/Icons/DeleteCircleFill';
import { RuntimeConstants } from '../../utils';
import { InteractiveIcon } from '../InteractiveIcon';
import { Box, Pressable } from '../Utility';
import { type BaseInputProps } from './types';

export const BaseInput = ({
  lx,
  style,
  containerStyle,
  inputStyle,
  labelStyle,
  label,
  errorMessage,
  hideClearButton,
  onChangeText: onChangeTextProp,
  editable,
  disabled: disabledProp = false,
  prefix,
  suffix,
  ref,
  ...props
}: BaseInputProps) => {
  const disabled = useDisabledContext({
    consumerName: 'BaseInput',
    mergeWith: { disabled: disabledProp },
  });
  const { t } = useCommonTranslation();
  const { theme } = useTheme();
  const inputRef = useRef<TextInput>(null);
  useImperativeHandle(ref, () => inputRef.current as TextInput);

  const [uncontrolledValue, setUncontrolledValue] = useState(
    props.defaultValue || '',
  );
  const [isFocused, setIsFocused] = useState(false);

  const isControlled = props.value !== undefined;
  const value = isControlled ? props.value : uncontrolledValue;

  const hasContent = isControlled
    ? !!props.value && props.value.length > 0
    : uncontrolledValue.length > 0;

  const showClearButton = hasContent && !disabled && !hideClearButton;

  const handleChangeText = useCallback(
    (text: string) => {
      if (!isControlled) {
        setUncontrolledValue(text);
      }
      onChangeTextProp?.(text);
    },
    [isControlled, onChangeTextProp],
  );

  const handleClear = () => {
    if (!isControlled) {
      setUncontrolledValue('');
    } else {
      onChangeTextProp?.('');
    }
    props.onClear?.();
  };

  const styles = useStyles({
    hasError: !!errorMessage,
    isFocused,
    isEditable: !disabled,
    hasLabel: !!label,
  });

  const floatingLabelStyles = useFloatingLabelStyles({
    hasContent,
    isFocused,
    showClearButton,
    hasError: !!errorMessage,
    isEditable: !disabled,
  });

  return (
    <DisabledProvider value={{ disabled }}>
      <Box lx={lx} style={style}>
        <Pressable
          style={StyleSheet.flatten([styles.container, containerStyle])}
          onPress={() => inputRef.current?.focus()}
          disabled={disabled}
        >
          {prefix}

          <TextInput
            ref={inputRef}
            value={value}
            style={StyleSheet.flatten([styles.input, inputStyle])}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChangeText={handleChangeText}
            editable={editable !== false && !disabled}
            autoCapitalize='none'
            autoCorrect={false}
            selectionColor={theme.colors.text.active}
            placeholderTextColor={theme.colors.text.muted}
            {...props}
          />

          {label && (
            <Animated.Text
              style={[
                floatingLabelStyles.label,
                floatingLabelStyles.animatedStyle,
                labelStyle,
              ]}
              numberOfLines={1}
            >
              {label}
            </Animated.Text>
          )}

          {(suffix || (!hideClearButton && !disabled)) && (
            <View style={styles.suffixContainer}>
              {showClearButton ? (
                <InteractiveIcon
                  iconType='stroked'
                  icon={DeleteCircleFill}
                  size={20}
                  onPress={handleClear}
                  accessibilityLabel={t(
                    'components.baseInput.clearInputAriaLabel',
                  )}
                />
              ) : (
                suffix
              )}
            </View>
          )}
        </Pressable>

        {errorMessage && (
          <View style={styles.errorContainer}>
            <DeleteCircleFill size={16} color='error' />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}
      </Box>
    </DisabledProvider>
  );
};

const useStyles = ({
  hasError,
  isFocused,
  isEditable,
  hasLabel,
}: {
  hasError: boolean;
  isFocused: boolean;
  isEditable: boolean;
  hasLabel: boolean;
}) => {
  return useStyleSheet(
    (t) => {
      return {
        container: StyleSheet.flatten([
          {
            position: 'relative',
            flexDirection: 'row',
            height: t.sizes.s48,
            width: t.sizes.full,
            alignItems: 'center',
            gap: t.spacings.s8,
            paddingHorizontal: t.spacings.s16,
            borderRadius: t.borderRadius.sm,
            backgroundColor: t.colors.bg.muted,
            borderWidth: t.borderWidth.s2,
            borderColor: 'transparent',
            overflow: 'hidden',
          },
          hasError && {
            borderWidth: 1,
            borderColor: t.colors.border.error,
          },
          !isEditable && {
            backgroundColor: t.colors.bg.disabled,
          },
          isFocused &&
            !hasError &&
            isEditable && { borderColor: t.colors.border.active },
        ]),
        input: StyleSheet.flatten([
          {
            position: 'relative',
            flex: 1,
            height: t.sizes.full,
            width: t.sizes.full,
            color: t.colors.text.base,
            backgroundColor: t.colors.bg.muted,
            outline: 'none',
          },
          hasLabel && {
            paddingTop: t.spacings.s20,
            paddingBottom: t.spacings.s4,
            paddingHorizontal: 0,
            ...t.typographies.body2,
          },
          RuntimeConstants.isIOS && hasLabel && { lineHeight: 0 },
          RuntimeConstants.isAndroid && { includeFontPadding: false },
          !isEditable && {
            backgroundColor: t.colors.bg.disabled,
            color: t.colors.text.disabled,
          },
        ]),
        errorContainer: {
          marginTop: t.spacings.s8,
          flexDirection: 'row',
          alignItems: 'center',
          gap: t.spacings.s2,
        },
        errorText: {
          color: t.colors.text.error,
          ...t.typographies.body3,
        },
        suffixContainer: {
          minWidth: t.sizes.s20,
          alignItems: 'center',
          justifyContent: 'center',
        },
      };
    },
    [hasError, isFocused, isEditable, hasLabel],
  );
};

const useAnimatedFloatingLabel = ({
  isFloatingLabel,
  theme,
}: {
  isFloatingLabel: boolean;
  theme: LumenStyleSheetTheme;
}) => {
  const floatingAnimation = useSharedValue(isFloatingLabel ? 1 : 0);
  const timingConfig = useTimingConfig({
    duration: 150,
    easing: 'linear',
  });

  useEffect(() => {
    floatingAnimation.value = withTiming(isFloatingLabel ? 1 : 0, timingConfig);

    return () => cancelAnimation(floatingAnimation);
  }, [isFloatingLabel, timingConfig, floatingAnimation]);

  const animatedStyle = useAnimatedStyle(
    () => ({
      top: interpolate(
        floatingAnimation.value,
        [0, 1],
        [theme.spacings.s14, theme.spacings.s6],
      ),
      fontSize: interpolate(
        floatingAnimation.value,
        [0, 1],
        [theme.typographies.body2.fontSize, theme.typographies.body4.fontSize],
      ),
    }),
    [floatingAnimation, theme],
  );

  return { animatedStyle };
};

const useFloatingLabelStyles = ({
  isFocused,
  hasContent,
  showClearButton,
  hasError,
  isEditable,
}: {
  isFocused: boolean;
  hasContent: boolean;
  showClearButton: boolean;
  hasError: boolean;
  isEditable: boolean;
}) => {
  const { theme } = useTheme();

  const { label } = useStyleSheet(
    (t) => ({
      label: StyleSheet.flatten([
        {
          position: 'absolute',
          left: t.spacings.s16,
          width: t.sizes.full,
          color: t.colors.text.muted,
        },
        hasContent &&
          showClearButton && {
            width: '92%',
          },
        !isEditable && {
          color: t.colors.text.disabled,
        },
        hasError && {
          color: t.colors.text.error,
        },
      ]),
    }),
    [hasContent, showClearButton, hasError, isEditable],
  );

  const { animatedStyle } = useAnimatedFloatingLabel({
    theme,
    isFloatingLabel: isFocused || hasContent,
  });

  return { label, animatedStyle };
};
