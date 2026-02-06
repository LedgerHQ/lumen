import { createSafeContext } from '@ledgerhq/lumen-utils-shared';
import React, { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { useCommonTranslation } from '../../../i18n';
import { useStyleSheet } from '../../../styles';
import { ArrowLeft } from '../../Symbols';
import { IconButton } from '../IconButton';
import { Box, Text } from '../Utility';
import { CoinCapsule } from './CoinCapsule';
import {
  NavBarAppearance,
  NavBarBackButtonProps,
  NavBarCoinCapsuleProps,
  NavBarContentProps,
  NavBarDescriptionProps,
  NavBarProps,
  NavBarTitleProps,
  NavBarTrailingProps,
} from './types';

type Slots = {
  backButton: ReactNode | null;
  content: ReactNode | null;
  trailing: ReactNode | null;
};

const [NavBarProvider, useNavBarContext] = createSafeContext<{
  appearance: NavBarAppearance;
}>('NavBar');

function extractSlots(children: ReactNode): Slots {
  const slots: Slots = {
    backButton: null,
    content: null,
    trailing: null,
  };

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const displayName = (child.type as any).displayName;

    switch (displayName) {
      case 'NavBarBackButton':
        slots.backButton = child;
        break;
      case 'NavBarContent':
        slots.content = child;
        break;
      case 'NavBarTrailing':
        slots.trailing = child;
        break;
      default:
        break;
    }
  });
  return slots;
}

export function NavBarContent({
  children,
  style,
  ...props
}: NavBarContentProps) {
  const { appearance } = useNavBarContext({
    consumerName: 'NavBarContent',
    contextRequired: true,
  });
  const styles = useStyles({ appearance });

  return (
    <Box style={[styles.content, style]} {...props}>
      {children}
    </Box>
  );
}

NavBarContent.displayName = 'NavBarContent';

export function NavBarTitle({ children, style, ...props }: NavBarTitleProps) {
  const { appearance } = useNavBarContext({
    consumerName: 'NavBarTitle',
    contextRequired: true,
  });
  const styles = useStyles({ appearance });

  return (
    <Text
      numberOfLines={appearance === 'compact' ? 1 : 2}
      style={[styles.title, style]}
      {...props}
    >
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

export function NavBarCoinCapsule({
  ticker,
  icon,
  ...props
}: NavBarCoinCapsuleProps) {
  return (
    <Box {...props}>
      <CoinCapsule ticker={ticker} icon={icon} />
    </Box>
  );
}

NavBarCoinCapsule.displayName = 'NavBarCoinCapsule';

export function NavBarBackButton({
  accessibilityLabel,
  onPress,
  style,
  ...props
}: NavBarBackButtonProps) {
  const { t } = useCommonTranslation();

  return (
    <IconButton
      appearance='no-background'
      size='md'
      accessibilityLabel={
        accessibilityLabel ?? t('components.bottomSheetHeader.goBackAriaLabel')
      }
      icon={ArrowLeft}
      onPress={onPress}
      style={style}
      {...props}
    />
  );
}

NavBarBackButton.displayName = 'NavBarBackButton';

/**
 * Trailing content area for the NavBar, typically used for action buttons like IconButtons.
 * Automatically positions itself at the end of the navbar and aligns with the back button.
 *
 * @example
 * <NavBarTrailing>
 *   <IconButton icon={Settings} accessibilityLabel="Settings" />
 * </NavBarTrailing>
 */
export function NavBarTrailing({
  children,
  style,
  ...props
}: NavBarTrailingProps) {
  const styles = useStyleSheet(
    (t) => ({
      container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: t.spacings.s4,
      },
    }),
    [],
  );

  return (
    <Box style={[styles.container, style]} {...props}>
      {children}
    </Box>
  );
}

NavBarTrailing.displayName = 'NavBarTrailing';

/**
 * NavBar component for top navigation
 */
export function NavBar({ appearance, children, ...props }: NavBarProps) {
  const styles = useStyles({ appearance });
  const slots = extractSlots(children);

  return (
    <NavBarProvider value={{ appearance }}>
      <Box style={styles.container} {...props}>
        {appearance === 'expanded' ? (
          <>
            <Box style={styles.topRow}>
              <Box style={styles.backButtonContainer}>{slots.backButton}</Box>
              {slots.trailing && (
                <Box style={styles.trailingContainer}>{slots.trailing}</Box>
              )}
            </Box>
            <Box style={styles.contentContainer}>{slots.content}</Box>
          </>
        ) : (
          <>
            <Box style={styles.backButtonContainer}>{slots.backButton}</Box>
            <Box style={styles.contentContainer}>{slots.content}</Box>
            {slots.trailing && (
              <Box style={styles.trailingContainer}>{slots.trailing}</Box>
            )}
          </>
        )}
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
        container: StyleSheet.flatten([
          {
            minWidth: t.sizes.full,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            gap: t.spacings.s4,
            paddingHorizontal: t.spacings.s4,
            paddingVertical: t.spacings.s8,
          },
          {
            ...(appearance === 'expanded' && {
              alignItems: 'flex-start',
              flexDirection: 'column',
            }),
          },
        ]),
        topRow: {
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          gap: t.spacings.s4,
        },
        backButtonContainer: StyleSheet.flatten([
          {
            paddingVertical: t.spacings.s8,
          },
          {
            ...(appearance === 'compact' && {
              position: 'absolute',
              left: t.spacings.s4,
              zIndex: 1,
            }),
          },
        ]),
        trailingContainer: StyleSheet.flatten([
          {
            paddingVertical: t.spacings.s8,
            flexShrink: 0,
          },
          {
            ...(appearance === 'compact' && {
              position: 'absolute',
              right: t.spacings.s4,
              zIndex: 1,
            }),
          },
          {
            ...(appearance === 'expanded' && {
              marginLeft: 'auto',
            }),
          },
        ]),
        contentContainer: StyleSheet.flatten([
          {
            flex: 1,
          },
          {
            ...(appearance === 'compact' && {
              paddingHorizontal: t.spacings.s48,
              alignItems: 'center',
              justifyContent: 'center',
            }),
          },
          {
            ...(appearance === 'expanded' && {
              paddingHorizontal: t.spacings.s12,
              paddingBottom: t.spacings.s12,
              width: '100%',
            }),
          },
        ]),
        content: StyleSheet.flatten([
          {
            flexDirection: 'column',
          },
          {
            ...(appearance === 'compact' && {
              alignItems: 'center',
              justifyContent: 'center',
            }),
          },
          {
            ...(appearance === 'expanded' && {
              gap: t.spacings.s8,
            }),
          },
        ]),
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
