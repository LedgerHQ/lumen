import {
  DisabledProvider,
  resolveBaseInputPlaceholder,
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
import type { LumenStyleSheetTheme } from '../../../styles';
import { useStyleSheet, useTheme } from '../../../styles';
import { useTimingConfig } from '../../Animations/useTimingConfig';
import { CheckmarkCircleFill } from '../../Symbols/Icons/CheckmarkCircleFill';
import { DeleteCircleFill } from '../../Symbols/Icons/DeleteCircleFill';
import { InformationFill } from '../../Symbols/Icons/InformationFill';
import { RuntimeConstants } from '../../utils';
import { InteractiveIcon } from '../InteractiveIcon';
import { Box, Pressable } from '../Utility';
import {
  type BaseInputCounterProps,
  type BaseInputHelperTextProps,
  type BaseInputProps,
} from './types';

export const BaseInput = ({
  lx,
  style,
  containerStyle,
  inputStyle,
  labelStyle,
  label,
  helperText,
  maxCount,
  status,
  hideClearButton,
  onChangeText: onChangeTextProp,
  editable,
  disabled: disabledProp = false,
  prefix,
  suffix,
  ref,
  placeholder: placeholderProp,
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

  const hasContent = (value ?? '').length > 0;

  const { inputPlaceholder, labelStaysFloatedWithPlaceholder } =
    resolveBaseInputPlaceholder({
      label,
      placeholder: placeholderProp,
    });

  const showClearButton = hasContent && !disabled && !hideClearButton;

  const count = (value ?? '').length;
  const showCount = Boolean(maxCount && maxCount > 0);
  const showHelper = !!helperText;

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
    if (isControlled) {
      onChangeTextProp?.('');
    } else {
      setUncontrolledValue('');
    }
    props.onClear?.();
  };

  const styles = useStyles({
    status,
    isFocused,
    isEditable: !disabled,
    hasLabel: !!label,
  });

  const floatingLabelStyles = useFloatingLabelStyles({
    hasContent,
    isFocused,
    showClearButton,
    status,
    isEditable: !disabled,
    labelStaysFloatedWithPlaceholder,
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
            placeholder={inputPlaceholder}
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

        {(showHelper || showCount) && (
          <View style={styles.footerContainer}>
            {showHelper && helperText ? (
              <BaseInputHelperText helperText={helperText} status={status} />
            ) : (
              <View />
            )}
            {maxCount !== undefined && maxCount > 0 && (
              <BaseInputCounter count={count} maxCount={maxCount} />
            )}
          </View>
        )}
      </Box>
    </DisabledProvider>
  );
};

const BaseInputHelperText = ({
  helperText,
  status,
}: BaseInputHelperTextProps) => {
  const styles = useHelperTextStyles({ status });

  return (
    <View style={styles.helperContainer}>
      {!status && <InformationFill size={16} color='muted' />}
      {status === 'error' && <DeleteCircleFill size={16} color='error' />}
      {status === 'success' && (
        <CheckmarkCircleFill size={16} color='success' />
      )}
      <Text style={styles.helperText}>{helperText}</Text>
    </View>
  );
};

const BaseInputCounter = ({ count, maxCount }: BaseInputCounterProps) => {
  const styles = useCounterStyles();

  return (
    <Text style={styles.counterText} accessibilityLiveRegion='polite'>
      {`${count}/${maxCount}`}
    </Text>
  );
};

const useStyles = ({
  status,
  isFocused,
  isEditable,
  hasLabel,
}: {
  status: 'error' | 'success' | undefined;
  isFocused: boolean;
  isEditable: boolean;
  hasLabel: boolean;
}) => {
  return useStyleSheet(
    (t) => {
      const hasStatusBorder = status === 'error' || status === 'success';
      const statusBorderColors = {
        error: t.colors.border.error,
        success: t.colors.border.success,
      } as const;
      const statusBorderColor = status ? statusBorderColors[status] : undefined;

      return {
        container: StyleSheet.flatten([
          {
            position: 'relative',
            flexDirection: 'row',
            minHeight: t.sizes.s48,
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
          hasStatusBorder &&
            statusBorderColor && {
              borderWidth: isFocused ? t.borderWidth.s2 : t.borderWidth.s1,
              borderColor: statusBorderColor,
            },
          !isEditable && {
            backgroundColor: t.colors.bg.disabled,
          },
          isFocused &&
            !hasStatusBorder &&
            isEditable && { borderColor: t.colors.border.active },
        ]),
        input: StyleSheet.flatten([
          {
            position: 'relative',
            flex: 1,
            width: t.sizes.full,
            color: t.colors.text.base,
            backgroundColor: t.colors.bg.muted,
            outline: 'none',
            ...t.typographies.body1,
            paddingTop: t.spacings.s4,
            paddingBottom: t.spacings.s2,
          },
          hasLabel && {
            paddingTop: t.spacings.s20,
            paddingBottom: t.spacings.s4,
            paddingHorizontal: 0,
            ...t.typographies.body2,
          },
          RuntimeConstants.isIOS && { lineHeight: 0 },
          RuntimeConstants.isAndroid && { includeFontPadding: false },
          !isEditable && {
            backgroundColor: t.colors.bg.disabled,
            color: t.colors.text.disabled,
          },
        ]),
        footerContainer: {
          marginTop: t.spacings.s8,
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: t.spacings.s8,
        },
        suffixContainer: {
          minWidth: t.sizes.s20,
          alignItems: 'center',
          justifyContent: 'center',
        },
      };
    },
    [status, isFocused, isEditable, hasLabel],
  );
};

const useHelperTextStyles = ({
  status,
}: {
  status: BaseInputProps['status'];
}) => {
  return useStyleSheet(
    (t) => ({
      helperContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: t.spacings.s2,
      },
      helperText: {
        ...t.typographies.body3,
        flex: 1,
        color: {
          error: t.colors.text.error,
          success: t.colors.text.success,
          default: t.colors.text.muted,
        }[status ?? 'default'],
      },
    }),
    [status],
  );
};

const useCounterStyles = () => {
  return useStyleSheet(
    (t) => ({
      counterText: {
        ...t.typographies.body3,
        flexShrink: 0,
        color: t.colors.text.muted,
      },
    }),
    [],
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
  status,
  isEditable,
  labelStaysFloatedWithPlaceholder,
}: {
  isFocused: boolean;
  hasContent: boolean;
  showClearButton: boolean;
  status: 'error' | 'success' | undefined;
  isEditable: boolean;
  labelStaysFloatedWithPlaceholder: boolean;
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
        status === 'error' && {
          color: t.colors.text.error,
        },
        !isEditable && {
          color: t.colors.text.disabled,
        },
      ]),
    }),
    [hasContent, showClearButton, status, isEditable],
  );

  const { animatedStyle } = useAnimatedFloatingLabel({
    theme,
    isFloatingLabel:
      isFocused || hasContent || labelStaysFloatedWithPlaceholder,
  });

  return { label, animatedStyle };
};
