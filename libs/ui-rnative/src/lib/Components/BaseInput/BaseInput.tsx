import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Animated, StyleSheet, Text, TextInput, View } from 'react-native';
import { useCommonTranslation } from '../../../i18n';
import { useStyleSheet, useTheme } from '../../../styles';
import { DeleteCircleFill } from '../../Symbols/Icons/DeleteCircleFill';
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
  editable = true,
  prefix,
  suffix,
  ref,
  ...props
}: BaseInputProps) => {
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

  const isFloatingLabel = isFocused || hasContent;
  const showClearButton = hasContent && editable && !hideClearButton;

  const floatingAnimation = useRef(
    new Animated.Value(isFloatingLabel ? 1 : 0),
  ).current;

  useEffect(() => {
    Animated.timing(floatingAnimation, {
      toValue: isFloatingLabel ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [isFloatingLabel, floatingAnimation]);

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
    isEditable: editable,
    hasLabel: !!label,
  });

  const floatingLabelStyles = useFloatingLabelStyles({
    floatingAnimation,
    hasContent,
    showClearButton,
    hasError: !!errorMessage,
    isEditable: editable,
  });

  return (
    <Box lx={lx} style={style}>
      <Pressable
        style={StyleSheet.flatten([styles.container, containerStyle])}
        onPress={() => inputRef.current?.focus()}
        disabled={!editable}
      >
        {prefix}

        <TextInput
          ref={inputRef}
          value={value}
          style={StyleSheet.flatten([styles.input, inputStyle])}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChangeText={handleChangeText}
          editable={editable}
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
              floatingLabelStyles.animatedLabel,
              labelStyle,
            ]}
            numberOfLines={1}
          >
            {label}
          </Animated.Text>
        )}

        {(suffix || (!hideClearButton && editable)) && (
          <View style={styles.suffixContainer}>
            {showClearButton ? (
              <InteractiveIcon
                iconType='stroked'
                onPress={handleClear}
                accessibilityLabel={t(
                  'components.baseInput.clearInputAriaLabel',
                )}
              >
                <DeleteCircleFill size={20} />
              </InteractiveIcon>
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
            outlineWidth: 0,
            outlineColor: 'transparent',
            ...t.typographies.body1,
          },
          hasLabel && {
            paddingTop: t.spacings.s16,
            paddingBottom: t.spacings.s2,
            ...t.typographies.body2,
          },
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

const useFloatingLabelStyles = ({
  floatingAnimation,
  hasContent,
  showClearButton,
  hasError,
  isEditable,
}: {
  floatingAnimation: Animated.Value;
  hasContent: boolean;
  showClearButton: boolean;
  hasError: boolean;
  isEditable: boolean;
}) => {
  const { theme } = useTheme();

  const label = useStyleSheet(
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

  const animatedLabel = {
    top: floatingAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [theme.spacings.s14, theme.spacings.s8],
    }),
    fontSize: floatingAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [
        theme.typographies.body2.fontSize,
        theme.typographies.body4.fontSize,
      ],
    }),
  };

  return { label: label.label, animatedLabel };
};

BaseInput.displayName = 'BaseInput';
