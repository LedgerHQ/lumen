import {
  createSafeContext,
  DisabledProvider,
  isTextChildren,
  useDisabledContext,
} from '@ledgerhq/lumen-utils-shared';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useStyleSheet } from '../../../../styles';
import { Box, Pressable, Text } from '../../primitives';
import type {
  TileContentProps,
  TileContextValue,
  TileDescriptionProps,
  TileHorizontalAlignment,
  TileProps,
  TileTitleProps,
  TileTrailingContentProps,
  TileVerticalAlignment,
} from './types';

const [TileProvider, useTileContext] = createSafeContext<TileContextValue>(
  'Tile',
  {
    horizontalAlignment: 'center',
  },
);

type Appearance = NonNullable<TileProps['appearance']>;

const alignItemsMap = {
  start: 'flex-start',
  center: 'center',
} as const satisfies Record<TileHorizontalAlignment, string>;

const textAlignMap = {
  start: 'left',
  center: 'center',
} as const satisfies Record<TileHorizontalAlignment, string>;

const useHorizontalAlignment = (
  consumerName: string,
): TileHorizontalAlignment =>
  useTileContext({ consumerName, contextRequired: false })
    .horizontalAlignment ?? 'center';

const useRootStyles = ({
  appearance,
  disabled,
  pressed,
  horizontalAlignment,
  verticalAlignment,
}: {
  appearance: Appearance;
  disabled: boolean;
  pressed: boolean;
  horizontalAlignment: TileHorizontalAlignment;
  verticalAlignment: TileVerticalAlignment;
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
            alignItems: alignItemsMap[horizontalAlignment],
            gap: t.spacings.s8,
            padding: t.spacings.s10,
            borderRadius: t.borderRadius.sm,
            backgroundColor: bgColors[appearance],
          },
          pressed &&
            !disabled && {
              backgroundColor: pressedBgColors[appearance],
            },
          verticalAlignment === 'center' && {
            justifyContent: 'center',
          },
        ]),
      };
    },
    [appearance, disabled, pressed, horizontalAlignment, verticalAlignment],
  );
};

/**
 * A flexible tile component that uses a composite pattern for maximum customization.
 * Displays content in a vertical layout with support for spots, text, and custom content.
 *
 * @see {@link https://ldls-react-native.vercel.app/?path=/docs/rnative-tile--docs Guidelines}
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
 *   <Spot icon={Wallet} />
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
 *   <Spot icon={Bitcoin} />
 *   <TileContent>
 *     <TileTitle>Bitcoin</TileTitle>
 *     <TileTrailingContent>
 *       <Tag label="Active" />
 *     </TileTrailingContent>
 *   </TileContent>
 * </Tile>
 */
export const Tile = ({
  lx = {},
  style,
  appearance = 'no-background',
  disabled: disabledProp = false,
  horizontalAlignment = 'center',
  verticalAlignment = 'start',
  children,
  ref,
  ...props
}: TileProps) => {
  const disabled = useDisabledContext({
    consumerName: 'Tile',
    mergeWith: { disabled: disabledProp },
  });

  return (
    <DisabledProvider value={{ disabled }}>
      <TileProvider value={{ horizontalAlignment }}>
        <Pressable
          ref={ref}
          lx={lx}
          style={StyleSheet.flatten([
            { width: '100%', overflow: 'hidden' },
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
              disabled={!!disabled}
              pressed={pressed}
              horizontalAlignment={horizontalAlignment}
              verticalAlignment={verticalAlignment}
            >
              {children}
            </TilePressableContent>
          )}
        </Pressable>
      </TileProvider>
    </DisabledProvider>
  );
};

const TilePressableContent = ({
  appearance,
  disabled,
  pressed,
  horizontalAlignment,
  verticalAlignment,
  children,
}: {
  appearance: Appearance;
  disabled: boolean;
  pressed: boolean;
  horizontalAlignment: TileHorizontalAlignment;
  verticalAlignment: TileVerticalAlignment;
  children: ReactNode;
}) => {
  const styles = useRootStyles({
    appearance,
    disabled,
    pressed,
    horizontalAlignment,
    verticalAlignment,
  });
  return (
    <View style={styles.container} testID='tile-container'>
      {children}
    </View>
  );
};

const useContentStyles = ({
  horizontalAlignment,
}: {
  horizontalAlignment: TileHorizontalAlignment;
}) => {
  return useStyleSheet(
    (t) => ({
      container: {
        width: t.sizes.full,
        alignItems: alignItemsMap[horizontalAlignment],
      },
    }),
    [horizontalAlignment],
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
 *       <Tag label="Active" />
 *     </TileTrailingContent>
 *   </TileContent>
 * </Tile>
 */
export const TileContent = ({ children, lx, style }: TileContentProps) => {
  const horizontalAlignment = useHorizontalAlignment('TileContent');
  const styles = useContentStyles({ horizontalAlignment });
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

const useTitleStyles = ({
  disabled,
  horizontalAlignment,
}: {
  disabled: boolean;
  horizontalAlignment: TileHorizontalAlignment;
}) => {
  return useStyleSheet(
    (t) => ({
      container: {
        width: t.sizes.full,
        alignItems: alignItemsMap[horizontalAlignment],
      },
      text: StyleSheet.flatten([
        t.typographies.body2SemiBold,
        {
          width: t.sizes.full,
          textAlign: textAlignMap[horizontalAlignment],
          color: disabled ? t.colors.text.disabled : t.colors.text.base,
        },
      ]),
    }),
    [disabled, horizontalAlignment],
  );
};

/**
 * The primary text label for a Tile. Automatically inherits the disabled state from the parent Tile.
 * Text will truncate with ellipsis if it exceeds the available width.
 * If children is a string, it will be automatically wrapped in a Text component.
 */
export const TileTitle = ({ children, lx, style }: TileTitleProps) => {
  const disabled = useDisabledContext({
    consumerName: 'TileTitle',
    contextRequired: true,
  });
  const horizontalAlignment = useHorizontalAlignment('TileTitle');
  const styles = useTitleStyles({ disabled, horizontalAlignment });

  if (isTextChildren(children)) {
    return (
      <Text
        testID='tile-title'
        numberOfLines={1}
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

const useDescriptionStyles = ({
  disabled,
  horizontalAlignment,
}: {
  disabled: boolean;
  horizontalAlignment: TileHorizontalAlignment;
}) => {
  return useStyleSheet(
    (t) => ({
      container: {
        width: t.sizes.full,
        alignItems: alignItemsMap[horizontalAlignment],
      },
      text: StyleSheet.flatten([
        t.typographies.body3,
        {
          width: t.sizes.full,
          textAlign: textAlignMap[horizontalAlignment],
          color: disabled ? t.colors.text.disabled : t.colors.text.muted,
        },
      ]),
    }),
    [disabled, horizontalAlignment],
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
  const disabled = useDisabledContext({
    consumerName: 'TileDescription',
    contextRequired: true,
  });
  const horizontalAlignment = useHorizontalAlignment('TileDescription');
  const styles = useDescriptionStyles({ disabled, horizontalAlignment });

  if (isTextChildren(children)) {
    return (
      <Text
        lx={lx}
        numberOfLines={1}
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

const useTrailingContentStyles = ({
  horizontalAlignment,
}: {
  horizontalAlignment: TileHorizontalAlignment;
}) => {
  return useStyleSheet(
    (t) => ({
      container: {
        width: t.sizes.full,
        alignItems: alignItemsMap[horizontalAlignment],
        marginTop: t.spacings.s4,
        gap: t.spacings.s8,
      },
    }),
    [horizontalAlignment],
  );
};

/**
 * A container for trailing content inside TileContent.
 * Use this to wrap Tags, labels, or other supplementary information after title and description.
 * Multiple items inside will have 8px spacing between them.
 *
 * @example
 * <Tile>
 *   <TileSpot icon={Settings} />
 *   <TileContent>
 *     <TileTitle>My Title</TileTitle>
 *     <TileDescription>Description</TileDescription>
 *     <TileTrailingContent>
 *       <Tag label="Active" />
 *     </TileTrailingContent>
 *   </TileContent>
 * </Tile>
 */
export const TileTrailingContent = ({
  children,
  lx,
  style,
}: TileTrailingContentProps) => {
  const horizontalAlignment = useHorizontalAlignment('TileTrailingContent');
  const styles = useTrailingContentStyles({ horizontalAlignment });
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
