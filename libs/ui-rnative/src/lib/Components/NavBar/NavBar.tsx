import React, { ReactNode } from 'react';
import { useStyleSheet } from '../../../styles';
import { ArrowLeft } from '../../Symbols';
import { IconButton } from '../IconButton';
import { Box, Text } from '../Utility';
import {
  NavBarBackButtonProps,
  NavBarDescriptionProps,
  NavBarProps,
  NavBarTitleProps,
} from './types';

function extractSlots(children: ReactNode) {
  const slots: Record<string, ReactNode | ReactNode[] | null> = {
    backButton: null,
    title: null,
    description: null,
    rest: [],
  };

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) {
      return;
    }
    if (child.type === NavBarBackButton) {
      slots.backButton = child;
    } else if (child.type === NavBarTitle) {
      slots.title = child;
    } else if (child.type === NavBarDescription) {
      slots.description = child;
    } else {
      (slots.rest as ReactNode[]).push(child);
    }
  });
  return slots;
}

export function NavBarTitle({ children, style, ...props }: NavBarTitleProps) {
  const styles = useStyles();

  return (
    <Text numberOfLines={1} style={[styles.title, style]} {...props}>
      {children}
    </Text>
  );
}

NavBarTitle.displayName = 'NavBarTitle';

export function NavBarDescription({
  children,
  style,
  ...props
}: NavBarDescriptionProps) {
  const styles = useStyles();

  return (
    <Text numberOfLines={1} style={[styles.description, style]} {...props}>
      {children}
    </Text>
  );
}

NavBarDescription.displayName = 'NavBarDescription';

export function NavBarBackButton({
  accessibilityLabel = 'Go back',
  onPress,
  style,
}: NavBarBackButtonProps) {
  const styles = useStyles();

  return (
    <IconButton
      appearance='no-background'
      size='md'
      accessibilityLabel={accessibilityLabel}
      icon={ArrowLeft}
      onPress={onPress}
      style={[styles.backButton, style]}
    />
  );
}

NavBarBackButton.displayName = 'NavBarBackButton';

/**
 * NavBar component for top navigation
 */
export function NavBar({ appearance, children, ...props }: NavBarProps) {
  const styles = useStyles();
  const slots = extractSlots(children);

  if (appearance === 'compact' || appearance === 'expanded') {
    return (
      <Box style={styles.container} {...props}>
        {slots.backButton}
        <Box style={styles.centerContent}>
          {slots.title}
          {slots.description}
        </Box>
        {slots.rest}
      </Box>
    );
  }

  if (appearance === 'with-asset') {
    return (
      <Box style={styles.container} {...props}>
        {slots.backButton}
        <Box style={styles.centerContent}>
          {slots.title}
          {/* Icon capsule will go here when implemented */}
        </Box>
        {slots.rest}
      </Box>
    );
  }

  return null;
}

NavBar.displayName = 'NavBar';

const useStyles = () =>
  useStyleSheet(
    (t) => ({
      container: {
        alignItems: 'center',
        minWidth: t.sizes.full,
      },
      centerContent: {
        flex: 1,
      },
      backButton: {
        position: 'absolute',
        left: t.sizes.s4,
      },
      title: {
        ...t.typographies.heading4SemiBold,
        color: t.colors.text.base,
        textAlign: 'center',
      },
      description: {
        ...t.typographies.body2,
        color: t.colors.text.muted,
        textAlign: 'center',
      },
    }),
    [],
  );
