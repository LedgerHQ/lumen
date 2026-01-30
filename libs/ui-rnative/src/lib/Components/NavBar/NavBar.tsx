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

export function NavBarTitle({ children }: NavBarTitleProps) {
  const styles = useStyles();

  return (
    <Text numberOfLines={1} style={styles.title}>
      {children}
    </Text>
  );
}

NavBarTitle.displayName = 'NavBarTitle';

export function NavBarDescription({ children }: NavBarDescriptionProps) {
  const styles = useStyles();

  return (
    <Text numberOfLines={1} style={styles.description}>
      {children}
    </Text>
  );
}

NavBarDescription.displayName = 'NavBarDescription';

export function NavBarBackButton({
  accessibilityLabel = 'Go back',
}: NavBarBackButtonProps) {
  const styles = useStyles();

  return (
    <IconButton
      appearance='no-background'
      size='md'
      accessibilityLabel={accessibilityLabel}
      icon={ArrowLeft}
      style={styles.backButton}
    />
  );
}

NavBarBackButton.displayName = 'NavBarBackButton';

function NavBarCompact({ children, ...props }: any) {
  const styles = useStyles();
  const slots = extractSlots(children);

  return (
    <Box style={styles.container} {...props}>
      {children}
    </Box>
  );
}

function NavBarExpanded({ children, ...props }: any) {
  const styles = useStyles();
  const slots = extractSlots(children);

  return (
    <Box style={styles.container} {...props}>
      {children}
    </Box>
  );
}

function NavBarWithAsset({ children, ...props }: any) {
  const styles = useStyles();
  const slots = extractSlots(children);

  return (
    <Box style={styles.container} {...props}>
      {children}
    </Box>
  );
}

/**
 * NavBar component for top navigation
 */
export function NavBar({ appearance, children, ...props }: NavBarProps) {
  const styles = useStyles();

  const layout = {
    compact: <NavBarCompact {...props} />,
    expanded: <NavBarExpanded {...props} />,
    'with-asset': <NavBarWithAsset {...props} />,
  }[appearance];

  return (
    <Box style={styles.container} {...props}>
      {layout}
    </Box>
  );
}

NavBar.displayName = 'NavBar';

const useStyles = () =>
  useStyleSheet(
    (t) => ({
      container: {
        minWidth: t.sizes.full,
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
      backButton: {
        position: 'absolute',
        left: t.spacings.s4,
        borderRadius: t.borderRadius.full,
        backgroundColor: t.colors.bg.baseTransparent,
      },
    }),
    [],
  );
