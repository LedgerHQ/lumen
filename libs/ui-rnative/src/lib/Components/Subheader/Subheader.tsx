import { StyleSheet } from 'react-native';
import { useStyleSheet } from '../../../styles';
import { ChevronRight, Information } from '../../Symbols';
import { InteractiveIcon } from '../InteractiveIcon';
import { Box, Pressable, Text } from '../Utility';
import {
  SubheaderActionProps,
  SubheaderCountProps,
  SubheaderDescriptionProps,
  SubheaderInfoProps,
  SubheaderProps,
  SubheaderRowProps,
  SubheaderShowMoreProps,
  SubheaderTitleProps,
} from './types';

/**
 * Title component for the Subheader. Displays the main heading.
 */
export const SubheaderTitle = ({
  children,
  lx,
  style,
  ...props
}: SubheaderTitleProps) => {
  const styles = useStyleSheet(
    (t) => ({
      title: StyleSheet.flatten([
        t.typographies.heading4SemiBold,
        {
          flexShrink: 1,
          color: t.colors.text.base,
        },
      ]),
    }),
    [],
  );

  return (
    <Text
      lx={lx}
      style={[styles.title, style]}
      numberOfLines={1}
      ellipsizeMode='tail'
      {...props}
    >
      {children}
    </Text>
  );
};

/**
 * Row component for the Subheader. Layout container to horizontally align title, count, hint, and action.
 * Can optionally be interactive with an onPress handler.
 */
export const SubheaderRow = ({
  children,
  onPress,
  lx,
  style,
  ...props
}: SubheaderRowProps) => {
  const styles = useStyleSheet(
    (t) => ({
      container: StyleSheet.flatten([
        {
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          gap: t.spacings.s4,
        },
      ]),
    }),
    [],
  );

  const mergedStyle = StyleSheet.flatten([styles.container, style]);

  if (onPress) {
    return (
      <Pressable lx={lx} style={mergedStyle} onPress={onPress} {...props}>
        {children}
      </Pressable>
    );
  }

  return (
    <Box lx={lx} style={mergedStyle} {...props}>
      {children}
    </Box>
  );
};

/**
 * Count component for the Subheader. Displays a formatted number.
 */
export const SubheaderCount = ({
  value,
  format,
  lx,
  style,
  ...props
}: SubheaderCountProps) => {
  const formatted = format ? format(value) : `(${value})`;

  const styles = useStyleSheet(
    (t) => ({
      count: StyleSheet.flatten([
        t.typographies.body2,
        {
          flexShrink: 0,
          color: t.colors.text.muted,
        },
      ]),
    }),
    [],
  );

  return (
    <Text lx={lx} style={[styles.count, style]} {...props}>
      {formatted}
    </Text>
  );
};

/**
 * Info component for the Subheader. Displays an information icon that can be wrapped in a Tooltip or BottomSheet.
 */
export const SubheaderInfo = ({
  iconType = 'stroked',
  style,
  ...props
}: SubheaderInfoProps) => {
  return (
    <InteractiveIcon
      iconType={iconType}
      accessibilityLabel='More information'
      style={style}
      {...props}
    >
      <Information size={16} />
    </InteractiveIcon>
  );
};

/**
 * ShowMore component for the Subheader. Displays a static chevron right icon to indicate expandable content.
 * Position this after SubheaderCount and before other elements.
 */
export const SubheaderShowMore = ({
  lx,
  style,
  ...props
}: SubheaderShowMoreProps) => {
  const styles = useStyleSheet(
    (t) => ({
      container: {
        flexShrink: 0,
        justifyContent: 'center',
        alignItems: 'center',
      },
      icon: {
        color: t.colors.text.muted,
      },
    }),
    [],
  );

  return (
    <Box lx={lx} style={[styles.container, style]} {...props}>
      <ChevronRight size={20} style={styles.icon} />
    </Box>
  );
};

/**
 * Description component for the Subheader. Displays descriptive text below the title row.
 */
export const SubheaderDescription = ({
  children,
  lx,
  style,
  ...props
}: SubheaderDescriptionProps) => {
  const styles = useStyleSheet(
    (t) => ({
      description: StyleSheet.flatten([
        t.typographies.body3,
        {
          color: t.colors.text.muted,
        },
      ]),
    }),
    [],
  );

  return (
    <Text lx={lx} style={[styles.description, style]} {...props}>
      {children}
    </Text>
  );
};

/**
 * Action component for the Subheader. Displays an interactive text button.
 * Automatically positions itself at the end of the row using marginLeft: 'auto'.
 */
export const SubheaderAction = ({
  children,
  onPress,
  lx,
  style,
  ...props
}: SubheaderActionProps) => {
  const styles = useStyleSheet(
    (t) => ({
      container: {
        flexShrink: 0,
        marginLeft: 'auto',
        paddingLeft: t.spacings.s8,
      },
      text: StyleSheet.flatten([
        t.typographies.body2,
        {
          color: t.colors.text.interactive,
        },
      ]),
    }),
    [],
  );

  return (
    <Pressable
      lx={lx}
      onPress={onPress}
      style={[styles.container, style]}
      {...props}
    >
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  );
};

/**
 * A subheader component for displaying section titles with optional count, hints, descriptions, and action elements.
 * Uses a composable API where you explicitly nest sub-components to define the layout.
 *
 * @example
 * // Simple subheader without row
 * <Subheader>
 *   <SubheaderTitle>Section Title</SubheaderTitle>
 *   <SubheaderDescription>Description text</SubheaderDescription>
 * </Subheader>
 *
 * @example
 * // Subheader with row for horizontal layout
 * <Subheader>
 *   <SubheaderRow>
 *     <SubheaderTitle>Section Title</SubheaderTitle>
 *     <SubheaderCount value={30} />
 *     <Tooltip>
 *       <TooltipTrigger>
 *         <SubheaderInfo />
 *       </TooltipTrigger>
 *       <TooltipContent content={<Text>Additional information</Text>} />
 *     </Tooltip>
 *   </SubheaderRow>
 *   <SubheaderDescription>Description text</SubheaderDescription>
 * </Subheader>
 *
 * @example
 * // Interactive row with action
 * <Subheader>
 *   <SubheaderRow onPress={handleClick}>
 *     <SubheaderTitle>Accounts</SubheaderTitle>
 *     <SubheaderCount value={12} />
 *   </SubheaderRow>
 * </Subheader>
 */
export const Subheader = ({
  lx,
  style,
  children,
  ...props
}: SubheaderProps) => {
  const styles = useStyleSheet(
    (t) => ({
      container: {
        width: '100%',
        flexDirection: 'column',
        gap: t.spacings.s4,
      },
    }),
    [],
  );

  return (
    <Box lx={lx} style={[styles.container, style]} {...props}>
      {children}
    </Box>
  );
};
