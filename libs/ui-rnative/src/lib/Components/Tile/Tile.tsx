import {
  createSafeContext,
  isTextChildren,
} from '@ledgerhq/lumen-utils-shared';
import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useStyleSheet } from '../../../styles';
import { Box, Pressable, Text } from '../Utility';
import {
  TileContentProps,
  TileContextValue,
  TileDescriptionProps,
  TileProps,
  TileTitleProps,
  TileTrailingContentProps,
} from './types';

const [TileProvider, useTileContext] =
  createSafeContext<TileContextValue>('Tile');

type Appearance = NonNullable<TileProps['appearance']>;

const useRootStyles = ({
  appearance,
  disabled,
  pressed,
  centered,
}: {
  appearance: Appearance;
  disabled: boolean;
  pressed: boolean;
  centered: boolean;
}) => {
  return useStyleSheet(
    (t) => {
      const bgColors: Record<Appearance, string> = {
        'no-background': t.colors.bg.baseTransparent,
        card: t.colors.bg.surface,
      };

      const pressedBgColors: Record<Appearance, string> = {
        'no-background': t.colors.bg.baseTransparentPressed,
        card: t.colors.bg.surfacePressed,
      };

      return {
        container: StyleSheet.flatten([
          {
            position: 'relative',
            flexDirection: 'column',
            overflow: 'hidden',
            width: '100%',
            flex: 1,
            alignItems: 'center',
            justifyContent: centered ? 'center' : 'flex-start',
            gap: t.spacings.s12,
            paddingHorizontal: t.spacings.s8,
            paddingVertical: t.spacings.s12,
            minWidth: 0,
            borderRadius: t.borderRadius.sm,
            backgroundColor: bgColors[appearance],
          },
          pressed &&
            !disabled && {
              backgroundColor: pressedBgColors[appearance],
            },
        ]),
      };
    },
    [appearance, disabled, pressed, centered],
  );
};

/**
 * A flexible tile component that uses a composite pattern for maximum customization.
 * Displays content in a vertical layout. Place Spot, TileContent (TileTitle, TileDescription, TileTrailingContent),
 * or other content as direct children.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/react-native_containment-tile--docs Storybook}
 * @see {@link https://ldls.vercel.app/?path=/docs/react-native_containment-tile--docs#dos-and-donts Guidelines}
 *
 * @warning The `lx` prop should only be used for layout adjustments like margins or positioning.
 * Do not use it to modify the tile's core appearance (colors, padding, etc). Use the `appearance` prop instead.
 *
 * @example
 * // Basic tile with icon and content
 * import { Tile, TileContent, TileTitle, TileDescription } from '@ledgerhq/lumen-ui-rnative';
 * import { Spot } from '@ledgerhq/lumen-ui-rnative';
 * import { Wallet } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Tile appearance="card" onPress={() => console.log('Pressed!')}>
 *   <Spot appearance="icon" icon={Wallet} />
 *   <TileContent>
 *     <TileTitle>My Wallet</TileTitle>
 *     <TileDescription>Description</TileDescription>
 *   </TileContent>
 * </Tile>
 *
 * @example
 * // With trailing content (Tags)
 * import { Tile, TileContent, TileTitle, TileTrailingContent, Tag } from '@ledgerhq/lumen-ui-rnative';
 * import { Bitcoin } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Tile appearance="card" onLongPress={() => console.log('Long pressed')}>
 *   <Spot appearance="icon" icon={Bitcoin} />
 *   <TileContent>
 *     <TileTitle>Bitcoin</TileTitle>
 *     <TileTrailingContent>
 *       <Tag label="First" />
 *       <Tag label="Second" />
 *     </TileTrailingContent>
 *   </TileContent>
 * </Tile>
 */
export const Tile = ({
  lx = {},
  style,
  appearance = 'no-background',
  disabled = false,
  centered = false,
  children,
  ref,
  ...props
}: TileProps) => {
  return (
    <TileProvider value={{ disabled }}>
      <Pressable
        ref={ref}
        lx={lx}
        style={StyleSheet.flatten([
          { width: '100%', overflow: 'hidden' },
          centered && { alignSelf: 'stretch' },
          style,
        ])}
        disabled={disabled}
        accessibilityRole='button'
        accessibilityState={{ disabled }}
        {...props}
      >
        {({ pressed }) => (
          <TilePressableContent
            appearance={appearance}
            disabled={disabled}
            pressed={pressed}
            centered={centered}
          >
            {children}
          </TilePressableContent>
        )}
      </Pressable>
    </TileProvider>
  );
};

Tile.displayName = 'Tile';

const TilePressableContent = ({
  appearance,
  disabled,
  pressed,
  centered,
  children,
}: {
  appearance: Appearance;
  disabled: boolean;
  pressed: boolean;
  centered: boolean;
  children: ReactNode;
}) => {
  const styles = useRootStyles({ appearance, disabled, pressed, centered });
  return <View style={styles.container}>{children}</View>;
};

const useContentStyles = () => {
  return useStyleSheet(
    (t) => ({
      container: {
        minWidth: 0,
        width: t.sizes.full,
        alignSelf: 'stretch',
        alignItems: 'center',
        overflow: 'hidden',
      },
    }),
    [],
  );
};
/**
 * A container for grouping TileTitle, TileDescription and TileTrailingContent with consistent spacing.
 * Use this to wrap text content within a Tile.
 *
 * @example
 * <Tile>
 *   <TileContent>
 *     <TileTitle>My Title</TileTitle>
 *     <TileDescription>Description</TileDescription>
 *     <TileTrailingContent>
 *       <Tag label="First" />
 *       <Tag label="Second" />
 *     </TileTrailingContent>
 *   </TileContent>
 * </Tile>
 */
export const TileContent = ({ children, lx, style }: TileContentProps) => {
  const styles = useContentStyles();
  return (
    <Box
      lx={lx}
      style={StyleSheet.flatten([styles.container, style])}
      testID='tile-content'
    >
      {children}
    </Box>
  );
};
TileContent.displayName = 'TileContent';

const useTitleStyles = ({ disabled }: { disabled: boolean }) => {
  return useStyleSheet(
    (t) => ({
      container: {
        width: t.sizes.full,
        minWidth: 0,
        alignItems: 'center',
      },
      text: StyleSheet.flatten([
        t.typographies.body2SemiBold,
        {
          alignItems: 'center',
          width: '100%',
          minWidth: 0,
          textAlign: 'center',
          color: disabled ? t.colors.text.disabled : t.colors.text.base,
        },
      ]),
    }),
    [disabled],
  );
};

/**
 * The primary text label for a Tile. Automatically inherits the disabled state from the parent Tile.
 * Text will truncate with ellipsis if it exceeds the available width.
 * If children is a string, it will be automatically wrapped in a Text component.
 */
export const TileTitle = ({ children, lx, style }: TileTitleProps) => {
  const { disabled } = useTileContext({
    consumerName: 'TileTitle',
    contextRequired: true,
  });
  const styles = useTitleStyles({ disabled });

  if (isTextChildren(children)) {
    return (
      <Text
        testID='tile-title'
        numberOfLines={1}
        ellipsizeMode='tail'
        lx={lx}
        style={StyleSheet.flatten([styles.text, style])}
      >
        {children}
      </Text>
    );
  }

  return (
    <Box
      lx={lx}
      style={StyleSheet.flatten([styles.container, style])}
      testID='tile-title'
    >
      {children}
    </Box>
  );
};
TileTitle.displayName = 'TileTitle';

const useTrailingContentStyles = () => {
  return useStyleSheet(
    (t) => ({
      container: {
        width: t.sizes.full,
        alignItems: 'center',
        marginTop: t.spacings.s4,
        gap: t.spacings.s8,
      },
    }),
    [],
  );
};

/**
 * A container for trailing content inside TileContent.
 * Use this to wrap Tags, labels, or other supplementary information after title and description.
 *
 * @example
 * <Tile>
 *   <Spot appearance="icon" icon={Settings} />
 *   <TileContent>
 *     <TileTitle>My Title</TileTitle>
 *     <TileTrailingContent>
 *       <Tag label="First" />
 *       <Tag label="Second" />
 *     </TileTrailingContent>
 *   </TileContent>
 * </Tile>
 */
export const TileTrailingContent = ({
  children,
  lx,
  style,
}: TileTrailingContentProps) => {
  const styles = useTrailingContentStyles();
  return (
    <Box
      lx={lx}
      style={StyleSheet.flatten([styles.container, style])}
      testID='tile-trailing-content'
    >
      {children}
    </Box>
  );
};
TileTrailingContent.displayName = 'TileTrailingContent';

const useDescriptionStyles = ({ disabled }: { disabled: boolean }) => {
  return useStyleSheet(
    (t) => ({
      container: {
        width: t.sizes.full,
        minWidth: 0,
        alignItems: 'center',
      },
      text: StyleSheet.flatten([
        t.typographies.body3,
        {
          width: '100%',
          minWidth: 0,
          alignItems: 'center',
          textAlign: 'center',
          color: disabled ? t.colors.text.disabled : t.colors.text.muted,
        },
      ]),
    }),
    [disabled],
  );
};

/**
 * The secondary text label for a Tile. Automatically inherits the disabled state from the parent Tile.
 * Text will truncate with ellipsis if it exceeds the available width.
 * If children is a string, it will be automatically wrapped in a Text component.
 *
 * @example
 * <Tile>
 *   <TileContent>
 *     <TileTitle>My Title</TileTitle>
 *     <TileDescription>My Description</TileDescription>
 *   </TileContent>
 * </Tile>
 */
export const TileDescription = ({
  children,
  lx,
  style,
}: TileDescriptionProps) => {
  const { disabled } = useTileContext({
    consumerName: 'TileDescription',
    contextRequired: true,
  });
  const styles = useDescriptionStyles({ disabled });

  if (isTextChildren(children)) {
    return (
      <Text
        lx={lx}
        numberOfLines={1}
        ellipsizeMode='tail'
        style={StyleSheet.flatten([styles.text, style])}
        testID='tile-description'
      >
        {children}
      </Text>
    );
  }

  return (
    <Box
      lx={lx}
      style={StyleSheet.flatten([styles.container, style])}
      testID='tile-description'
    >
      {children}
    </Box>
  );
};
TileDescription.displayName = 'TileDescription';
