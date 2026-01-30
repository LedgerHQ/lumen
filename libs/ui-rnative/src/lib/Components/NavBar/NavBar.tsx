import { createSafeContext } from '@ledgerhq/lumen-utils-shared';
import React, { ReactNode } from 'react';
import { useStyleSheet } from '../../../styles';
import { ArrowLeft } from '../../Symbols';
import { IconButton } from '../IconButton';
import { Box, Text } from '../Utility';
import {
  NavBarAppearance,
  NavBarBackButtonProps,
  NavBarDescriptionProps,
  NavBarProps,
  NavBarTitleProps,
} from './types';

type Slots = {
  backButton: ReactNode | null;
  title: ReactNode | null;
  description: ReactNode | null;
  rest: ReactNode[];
};

const [NavBarProvider, useNavBarContext] = createSafeContext<{
  appearance: NavBarAppearance;
}>('NavBar');

function extractSlots(children: ReactNode): Slots {
  const slots: Slots = {
    backButton: null,
    title: null,
    description: null,
    rest: [],
  };

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) {
      return;
    }
    const displayName = (child.type as any).displayName;

    switch (displayName) {
      case 'NavBarBackButton':
        slots.backButton = child;
        break;
      case 'NavBarTitle':
        slots.title = child;
        break;
      case 'NavBarDescription':
        slots.description = child;
        break;
      default:
        slots.rest.push(child);
    }
  });
  return slots;
}

export function NavBarTitle({ children, style, ...props }: NavBarTitleProps) {
  const { appearance } = useNavBarContext({
    consumerName: 'NavBarTitle',
    contextRequired: true,
  });
  const styles = useStyles({ appearance });

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
  const { appearance } = useNavBarContext({
    consumerName: 'NavBarDescription',
    contextRequired: true,
  });
  const styles = useStyles({ appearance });

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
  return (
    <IconButton
      appearance='no-background'
      size='md'
      accessibilityLabel={accessibilityLabel}
      icon={ArrowLeft}
      onPress={onPress}
      style={style}
    />
  );
}

NavBarBackButton.displayName = 'NavBarBackButton';

/**
 * NavBar component for top navigation
 */
export function NavBar({ appearance, children, ...props }: NavBarProps) {
  const styles = useStyles({ appearance });
  const slots = extractSlots(children);

  return (
    <NavBarProvider value={{ appearance }}>
      <Box style={styles.container} {...props}>
        <Box style={styles.backButtonContainer}>{slots.backButton}</Box>
        <Box style={styles.headerContainer}>
          {slots.title}
          {slots.description}
        </Box>
      </Box>
    </NavBarProvider>
  );
}

NavBar.displayName = 'NavBar';

type StyleParams = {
  appearance: NavBarAppearance;
};

const useStyles = ({ appearance }: StyleParams) => {
  return useStyleSheet(
    (t) => {
      return {
        container: {
          minWidth: t.sizes.full,
        },
        backButtonContainer: {
          ...(appearance === 'compact' && {
            position: 'absolute',
            left: t.spacings.s4,
          }),
          ...(appearance === 'expanded' && {
            alignSelf: 'flex-start',
            marginBottom: t.spacings.s8,
          }),
        },
        headerContainer: {
          ...(appearance === 'expanded' && {
            paddingLeft: t.spacings.s16,
            gap: t.spacings.s8,
          }),
        },
        title: {
          ...t.typographies.heading4SemiBold,
          color: t.colors.text.base,
          textAlign: appearance === 'expanded' ? 'left' : 'center',
        },
        description: {
          ...t.typographies.body2,
          color: t.colors.text.muted,
          textAlign: appearance === 'expanded' ? 'left' : 'center',
        },
      };
    },
    [appearance],
  );
};
