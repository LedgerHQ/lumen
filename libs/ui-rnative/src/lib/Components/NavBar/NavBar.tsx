import { createSafeContext } from '@ledgerhq/lumen-utils-shared';
import React, { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { useStyleSheet } from '../../../styles';
import { ArrowLeft } from '../../Symbols';
import { IconButton } from '../IconButton';
import { Box, Text } from '../Utility';
import { CoinCapsule } from './CoinCapsule';
import {
  NavBarAppearance,
  NavBarBackButtonProps,
  NavBarCoinCapsuleProps,
  NavBarDescriptionProps,
  NavBarProps,
  NavBarTitleProps,
} from './types';

type Slots = {
  backButton: ReactNode | null;
  title: ReactNode | null;
  description: ReactNode | null;
  coinCapsule: ReactNode | null;
};

const [NavBarProvider, useNavBarContext] = createSafeContext<{
  appearance: NavBarAppearance;
}>('NavBar');

function extractSlots(children: ReactNode): Slots {
  const slots: Slots = {
    backButton: null,
    title: null,
    description: null,
    coinCapsule: null,
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
      case 'NavBarTitle':
        slots.title = child;
        break;
      case 'NavBarDescription':
        slots.description = child;
        break;
      case 'NavBarCoinCapsule':
        slots.coinCapsule = child;
        break;
      default:
        break;
    }
  });
  return slots;
}

export function NavBarCoinCapsule({ ticker, icon }: NavBarCoinCapsuleProps) {
  const { appearance } = useNavBarContext({
    consumerName: 'NavBarTitle',
    contextRequired: true,
  });
  const styles = useStyles({ appearance });

  return (
    <Box style={styles.coinCapsule}>
      <CoinCapsule ticker={ticker} icon={icon} />
    </Box>
  );
}

NavBarCoinCapsule.displayName = 'NavBarCoinCapsule';

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
          {appearance !== 'with-asset' ? (
            <>
              {slots.title}
              {slots.description}
            </>
          ) : (
            slots.coinCapsule
          )}
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
        container: StyleSheet.flatten([
          {
            minWidth: t.sizes.full,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
          },
          {
            ...(appearance === 'compact' && {
              paddingVertical: t.spacings.s8,
            }),
          },
          {
            ...(appearance === 'expanded' && {
              alignItems: 'flex-start',
              flexDirection: 'column',
            }),
          },
          {
            ...(appearance === 'with-asset' && {
              paddingVertical: t.spacings.s12,
            }),
          },
        ]),
        backButtonContainer: StyleSheet.flatten([
          {
            paddingLeft: t.spacings.s4,
            paddingVertical: t.spacings.s8,
          },
          {
            ...(appearance !== 'expanded' && {
              position: 'absolute',
              left: t.spacings.s0,
              zIndex: 1,
            }),
          },
        ]),
        headerContainer: StyleSheet.flatten([
          {
            flex: 1,
            ...(appearance !== 'expanded' && {
              paddingHorizontal: t.spacings.s48,
            }),
          },
          {
            ...(appearance === 'expanded' && {
              paddingHorizontal: t.spacings.s16,
              paddingBottom: t.spacings.s12,
              gap: t.spacings.s8,
              width: '100%',
            }),
          },
          {
            ...(appearance === 'with-asset' && {
              alignItems: 'center',
              justifyContent: 'center',
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
        coinCapsule: {
          ...(appearance !== 'with-asset' && {
            alignSelf: 'flex-start',
          }),
        },
      };
    },
    [appearance],
  );
};
