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
import { getMultilineLayout, getMultilineMinHeight } from './multilineLayout';
import { type BaseInputProps, type BaseInputStatus } from './types';
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
  multiline = false,
  minLines = 1,
  maxLines,
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

  const hasLabel = !!label;

  const styles = useStyles({
    status,
    isFocused,
    isEditable: !disabled,
    hasLabel,
    multiline,
    minLines,
    maxLines,
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
            multiline={multiline}
            // iOS hands the drag to the parent by default and the container Pressable
            // claims it, which stops a clamped field from scrolling.
            rejectResponderTermination={!multiline}
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

type StyleParams = {
  status: BaseInputStatus | undefined;
  isFocused: boolean;
  isEditable: boolean;
  hasLabel: boolean;
  multiline: boolean;
  minLines: number;
  maxLines: number | undefined;
};

const useRowStyles = ({
  status,
  isFocused,
  isEditable,
  hasLabel,
  multiline,
  minLines,
  maxLines,
}: StyleParams) => {
  return useStyleSheet(
    (t) => {
      const statusBorderColors = {
        error: t.colors.border.error,
        success: t.colors.border.success,
      } as const;
      const statusBorderColor = status ? statusBorderColors[status] : undefined;
      const borderWidth =
        statusBorderColor && !isFocused ? t.borderWidth.s1 : t.borderWidth.s2;

      const { paddingVertical } = getMultilineLayout(t, hasLabel);

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
            borderWidth,
            borderColor: 'transparent',
            overflow: 'hidden',
          },
          statusBorderColor && { borderColor: statusBorderColor },
          !isEditable && {
            backgroundColor: t.colors.bg.disabled,
          },
          isFocused &&
            !statusBorderColor &&
            isEditable && { borderColor: t.colors.border.active },
          multiline && {
            alignItems: 'flex-start',
            paddingVertical,
            // The floor lives here so the input box stays exactly as tall as its text:
            // Android centres a line within its box, and that centring is what keeps
            // the value level with the placeholder, whose hint takes no line-height span.
            minHeight: getMultilineMinHeight(t, {
              hasLabel,
              minLines,
              maxLines,
            }),
          },
        ]),
        suffixContainer: StyleSheet.flatten([
          {
            minWidth: t.sizes.s20,
            alignItems: 'center',
            justifyContent: 'center',
          },
          multiline && { marginTop: t.spacings.s2 },
        ]),
      };
    },
    [status, isFocused, isEditable, hasLabel, multiline, minLines, maxLines],
  );
};

const useInputStyles = ({
  isEditable,
  hasLabel,
  multiline,
  maxLines,
}: Omit<StyleParams, 'status' | 'isFocused' | 'minLines'>) => {
  return useStyleSheet(
    (t) => {
      const { lineHeight, labelRowHeight } = getMultilineLayout(t, hasLabel);

      return {
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
          multiline && {
            paddingTop: 0,
            paddingBottom: 0,
            marginTop: labelRowHeight,
            // Native measures the text and Yoga clamps it between one line and
            // maxLines — that is the whole autosize mechanism.
            minHeight: lineHeight,
            maxHeight: maxLines ? maxLines * lineHeight : undefined,
          },
          // Only Android takes the token line height. iOS centres a Text's glyph inside
          // an explicit line height but leaves a TextInput's at the bottom of it, so one
          // here would drop the value and the placeholder below the prefix and the label.
          multiline && RuntimeConstants.isAndroid && { lineHeight },
        ]),
      };
    },
    [isEditable, hasLabel, multiline, maxLines],
  );
};

const useFooterStyles = () => {
  return useStyleSheet(
    (t) => ({
      footerContainer: {
        marginTop: t.spacings.s8,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: t.spacings.s8,
      },
    }),
    [],
  );
};

const useStyles = (params: StyleParams) => {
  const { container, suffixContainer } = useRowStyles(params);
  const { input } = useInputStyles(params);
  const { footerContainer } = useFooterStyles();

  return { container, input, suffixContainer, footerContainer };
};
