import { StyleSheet, Text, View } from 'react-native';
import { useStyleSheet } from '../../../styles';
import { ChevronRight } from '../../Symbols';
import { Pressable } from '../Utility';

import { CardButtonProps } from './types';

type Appearance = NonNullable<CardButtonProps['appearance']>;

const useStyles = ({
  appearance,
  disabled,
  pressed,
}: {
  appearance: Appearance;
  disabled: boolean;
  pressed: boolean;
}) => {
  return useStyleSheet(
    (t) => {
      const bgColors: Record<Appearance, string> = {
        base: t.colors.bg.muted,
        outline: 'transparent',
      };

      const pressedBgColors: Record<Appearance, string> = {
        base: t.colors.bg.mutedPressed,
        outline: t.colors.bg.baseTransparentPressed,
      };

      return {
        container: StyleSheet.flatten([
          {
            flexDirection: 'row',
            alignItems: 'center',
            width: t.sizes.full,
            gap: t.spacings.s12,
            padding: t.spacings.s12,
            borderRadius: t.borderRadius.sm,
            backgroundColor: bgColors[appearance],
          },
          appearance === 'outline' && {
            borderStyle: 'dashed',
            borderWidth: t.borderWidth.s1,
            borderColor: t.colors.border.mutedSubtle,
          },
          pressed && {
            backgroundColor: pressedBgColors[appearance],
          },
          pressed &&
            appearance === 'outline' && {
              borderColor: t.colors.border.mutedSubtlePressed,
            },
          disabled && {
            backgroundColor:
              appearance === 'outline' ? 'transparent' : t.colors.bg.disabled,
          },
          disabled &&
            appearance === 'outline' && {
              borderColor: t.colors.border.disabled,
            },
        ]),
        contentWrapper: {
          flex: 1,
          minWidth: 0,
          flexDirection: 'column',
          gap: t.spacings.s4,
        },
        title: StyleSheet.flatten([
          t.typographies.body1SemiBold,
          {
            color: disabled ? t.colors.text.disabled : t.colors.text.base,
            minWidth: 0,
            textAlign: 'left',
          },
        ]),
        description: StyleSheet.flatten([
          t.typographies.body2,
          {
            color: disabled ? t.colors.text.disabled : t.colors.text.base,
            minWidth: 0,
          },
        ]),
        icon: {
          flexShrink: 0,
          color: disabled ? t.colors.text.disabled : t.colors.text.base,
        },
      };
    },
    [appearance, disabled, pressed],
  );
};

/**
 * A customizable card button component that displays an optional icon, a required title, an optional description, and an optional chevron arrow.
 *
 * It supports different appearances. Takes only the necessary width based on content. The chevron can be hidden if needed.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/react-native_action-cardbutton--docs Storybook}
 * @see {@link https://ldls.vercel.app/?path=/docs/react-native_action-cardbutton--docs#dos-and-donts Guidelines}
 *
 * @warning The `lx` prop should only be used for layout adjustments like margins or positioning.
 * Do not use it to modify the card button's core appearance (colors, padding, etc). Use the `appearance` prop instead.
 *
 * @example
 * // Basic card button
 * import { CardButton } from '@ledgerhq/lumen-ui-rnative';
 *
 * <CardButton title="Click Me" onPress={() => console.log('Clicked!')} />
 *
 * @example
 * // Card button with icon and description
 * import { CardButton } from '@ledgerhq/lumen-ui-rnative';
 * import { Info } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <CardButton
 *   icon={Info}
 *   title="Information"
 *   description="Additional details here"
 *   appearance="outline"
 * />
 */
export const CardButton = ({
  lx,
  style,
  appearance = 'base',
  icon,
  title,
  description,
  hideChevron,
  disabled = false,
  ref,
  ...props
}: CardButtonProps) => {
  return (
    <Pressable
      ref={ref}
      lx={lx}
      style={StyleSheet.flatten([style, { flex: 1 }])}
      disabled={disabled}
      accessibilityRole='button'
      accessibilityState={{ disabled }}
      {...props}
    >
      {({ pressed }) => (
        <CardButtonContent
          appearance={appearance}
          disabled={disabled}
          pressed={pressed}
          icon={icon}
          title={title}
          description={description}
          hideChevron={hideChevron}
        />
      )}
    </Pressable>
  );
};

type CardButtonContentProps = {
  appearance: Appearance;
  disabled: boolean;
  pressed: boolean;
  icon: CardButtonProps['icon'];
  title: string;
  description?: string;
  hideChevron?: boolean;
};

const CardButtonContent = ({
  appearance,
  disabled,
  pressed,
  icon,
  title,
  description,
  hideChevron,
}: CardButtonContentProps) => {
  const IconComponent = icon;
  const styles = useStyles({ appearance, disabled, pressed });

  return (
    <View style={styles.container} testID='card-button-content'>
      {IconComponent && <IconComponent size={24} style={styles.icon} />}
      <View style={styles.contentWrapper}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode='tail'>
          {title}
        </Text>
        {description && (
          <Text
            style={styles.description}
            numberOfLines={2}
            ellipsizeMode='tail'
          >
            {description}
          </Text>
        )}
      </View>
      {!hideChevron && <ChevronRight size={24} style={styles.icon} />}
    </View>
  );
};

CardButton.displayName = 'CardButton';
