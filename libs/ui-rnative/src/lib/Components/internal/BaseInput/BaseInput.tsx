import {
  DisabledProvider,
  resolveBaseInputPlaceholder,
  useDisabledContext,
} from '@ledgerhq/lumen-utils-shared';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useCommonTranslation } from '../../../../i18n';
import { useStyleSheet, useTheme } from '../../../../styles';
import { RuntimeConstants } from '../../../utils';
import { InteractiveIcon } from '../../core/InteractiveIcon';
import { Box, Pressable } from '../../primitives';
import { DeleteCircleFill } from '../../symbols/icons/DeleteCircleFill';
import { BaseInputCounter } from './BaseInputCounter';
import { BaseInputHelperText } from './BaseInputHelperText';
import { BaseInputLabel } from './BaseInputLabel';
import { type BaseInputProps } from './types';
import { useBaseInputValue } from './useBaseInputValue';

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
  readOnly = false,
  disabled: disabledProp = false,
  prefix,
  suffix,
  ref,
  placeholder: placeholderProp,
  onClear,
  ...props
}: BaseInputProps) => {
  const disabled = useDisabledContext({
    consumerName: 'BaseInput',
    mergeWith: { disabled: disabledProp },
  });
  const { t } = useCommonTranslation();
  const { theme } = useTheme();

  const {
    inputRef,
    composedRef,
    value,
    hasContent,
    handleChangeText,
    handleClear,
  } = useBaseInputValue({
    value: props.value,
    defaultValue: props.defaultValue,
    onChangeText: onChangeTextProp,
    onClear,
    ref,
  });

  const [isFocused, setIsFocused] = useState(false);

  const { inputPlaceholder, labelStaysFloatedWithPlaceholder } =
    resolveBaseInputPlaceholder({
      label,
      placeholder: placeholderProp,
    });

  const showClearButton =
    hasContent && !disabled && !readOnly && !hideClearButton;

  const count = (value ?? '').length;
  const showCount = Boolean(maxCount && maxCount > 0);
  const showHelper = !!helperText;

  // Both properties can be used to determine if the input is editable.
  const isEditable = editable !== false && !readOnly && !disabled;

  const styles = useStyles({
    status,
    isFocused,
    isEditable: !disabled,
    hasLabel: !!label,
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
            ref={composedRef}
            value={value}
            placeholder={inputPlaceholder}
            style={StyleSheet.flatten([styles.input, inputStyle])}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChangeText={handleChangeText}
            editable={isEditable}
            autoCapitalize='none'
            autoCorrect={false}
            selectionColor={theme.colors.text.active}
            placeholderTextColor={theme.colors.text.muted}
            {...props}
          />

          {label && (
            <BaseInputLabel
              isFocused={isFocused}
              hasContent={hasContent}
              showClearButton={showClearButton}
              status={status}
              isEditable={!disabled}
              labelStaysFloatedWithPlaceholder={
                labelStaysFloatedWithPlaceholder
              }
              style={labelStyle}
            >
              {label}
            </BaseInputLabel>
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
