import { useBottomSheet } from '@gorhom/bottom-sheet';
import { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { useCommonTranslation } from '../../../i18n';
import { useStyleSheet } from '../../../styles';
import { ArrowLeft, Close } from '../../Symbols';
import { IconButton } from '../IconButton';
import { Box, Text } from '../Utility';
import { useBottomSheetContext } from './BottomSheet';
import { BottomSheetHeaderProps } from './types';

type Appearance = NonNullable<BottomSheetHeaderProps['appearance']>;

const Z_INDEX_DIALOG_CONTENT = 1000;

const useStyles = ({
  appearance,
  spacing,
  hidden,
}: {
  appearance: Appearance;
  spacing: boolean;
  hidden: boolean;
}) => {
  return useStyleSheet(
    (t) => ({
      root: StyleSheet.flatten([
        {
          position: 'relative',
          zIndex: Z_INDEX_DIALOG_CONTENT,
          backgroundColor: t.colors.bg.canvasSheet,
          paddingBottom: t.spacings.s12,
        },
        spacing && {
          paddingHorizontal: t.spacings.s16,
        },
      ]),
      inner: StyleSheet.flatten([
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: t.spacings.s16,
        },
        appearance === 'expanded' && {
          marginBottom: t.spacings.s16,
        },
        hidden && {
          display: 'none',
        },
      ]),
      textWrapper: StyleSheet.flatten([
        {
          flex: 1,
        },
        appearance === 'expanded' && {
          gap: t.spacings.s4,
          flex: 0,
        },
      ]),
      title: StyleSheet.flatten([
        {
          color: t.colors.text.base,
        },
        appearance === 'expanded' && {
          ...t.typographies.heading3SemiBold,
        },
        appearance === 'compact' && {
          textAlign: 'center',
          ...t.typographies.heading5SemiBold,
        },
      ]),
      description: StyleSheet.flatten([
        t.typographies.body2,
        {
          color: t.colors.text.muted,
          textAlign: appearance === 'compact' ? 'center' : 'left',
        },
      ]),
      iconPlaceholder: {
        width: t.sizes.s32,
        height: t.sizes.s32,
      },
    }),
    [appearance, spacing, hidden],
  );
};

export const BottomSheetHeader = ({
  lx,
  style,
  title,
  description,
  appearance = 'compact',
  spacing = false,
  ...props
}: BottomSheetHeaderProps) => {
  const { t } = useCommonTranslation();
  const { close } = useBottomSheet();
  const { onBack, hideCloseButton } = useBottomSheetContext({
    consumerName: 'BottomSheetHeader',
    contextRequired: true,
  });

  const handleClose = useCallback(() => {
    close();
  }, [close]);

  const hasTitleSection = Boolean(title || description);
  const hasIcons = Boolean(onBack || !hideCloseButton);

  const styles = useStyles({
    appearance,
    spacing,
    hidden: !hasIcons && appearance !== 'compact',
  });

  if (!title && !description && !onBack && hideCloseButton) {
    return null;
  }

  const titleComponent = hasTitleSection ? (
    <Box style={styles.textWrapper}>
      {title && <Text style={styles.title}>{title}</Text>}
      {description && <Text style={styles.description}>{description}</Text>}
    </Box>
  ) : null;

  return (
    <Box {...props} lx={lx} style={[styles.root, style]}>
      <Box style={styles.inner}>
        <Box style={styles.iconPlaceholder}>
          {onBack && (
            <IconButton
              accessibilityLabel={t(
                'components.bottomSheetHeader.goBackAriaLabel',
              )}
              size='xs'
              onPress={onBack}
              icon={ArrowLeft}
              appearance='transparent'
            />
          )}
        </Box>
        {appearance === 'compact' && titleComponent}
        <Box style={styles.iconPlaceholder}>
          {!hideCloseButton && (
            <IconButton
              accessibilityLabel={t(
                'components.bottomSheetHeader.closeAriaLabel',
              )}
              size='xs'
              onPress={handleClose}
              icon={Close}
              appearance='transparent'
            />
          )}
        </Box>
      </Box>
      {appearance === 'expanded' && titleComponent}
    </Box>
  );
};
BottomSheetHeader.displayName = 'BottomSheetHeader';
