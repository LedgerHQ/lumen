import { getPaginationRange } from '@ledgerhq/lumen-utils-shared';
import { useCallback, useEffect, useRef } from 'react';
import type { LayoutChangeEvent, LayoutRectangle } from 'react-native';
import { ScrollView } from 'react-native';
import { useStyleSheet } from '../../../../styles';
import { useCommonTranslation } from '../../../../translations';
import { Box } from '../../primitives/Box';
import { Text } from '../../primitives/Text';
import { ChevronLeft, ChevronRight } from '../../symbols';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import type { PaginationProps } from './types';

const usePaginationStyles = () =>
  useStyleSheet(
    (t) => ({
      root: {
        flexDirection: 'row',
        alignItems: 'center',
        maxWidth: '100%',
        gap: t.spacings.s8,
        padding: t.spacings.s4,
      },
      scroll: { flexGrow: 0, flexShrink: 1 },
      scrollContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: t.spacings.s8,
      },
      pageOfTotal: {
        ...t.typographies.body2SemiBold,
        color: t.colors.text.base,
        paddingHorizontal: t.spacings.s4,
      },
      ellipsis: {
        width: t.sizes.s40,
        alignItems: 'center',
        justifyContent: 'center',
      },
      ellipsisText: {
        ...t.typographies.body2,
        color: t.colors.text.muted,
      },
    }),
    [],
  );

/**
 * Keeps the active page centered in the scrollable range, so navigating with
 * the arrows never leaves it off-screen.
 */
const useScrollToActivePage = (activePage: number) => {
  const scrollRef = useRef<ScrollView>(null);
  const viewportWidth = useRef(0);
  const pageLayouts = useRef(new Map<number, LayoutRectangle>());

  const scrollToActivePage = useCallback((): void => {
    const layout = pageLayouts.current.get(activePage);
    if (!layout || !viewportWidth.current) return;
    scrollRef.current?.scrollTo({
      x: Math.max(0, layout.x + layout.width / 2 - viewportWidth.current / 2),
      animated: false,
    });
  }, [activePage]);

  useEffect(scrollToActivePage, [scrollToActivePage]);

  const onViewportLayout = (event: LayoutChangeEvent): void => {
    viewportWidth.current = event.nativeEvent.layout.width;
    scrollToActivePage();
  };

  const onPageLayout = (page: number, event: LayoutChangeEvent): void => {
    pageLayouts.current.set(page, event.nativeEvent.layout);
    if (page === activePage) scrollToActivePage();
  };

  return { scrollRef, onViewportLayout, onPageLayout };
};

/**
 * Pagination navigation for lists and other paginated content.
 *
 * @see [Figma – Pagination](https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7/2.-Components-Library?node-id=11768-12849&m=dev)
 *
 * @example
 * <Pagination
 *   page={page}
 *   totalPages={10}
 *   onPageChange={setPage}
 * />
 */
export const Pagination = ({
  page,
  totalPages,
  onPageChange,
  siblingCount = 1,
  density = 'expanded',
  lx,
  style,
  ref,
  ...props
}: PaginationProps) => {
  const { t } = useCommonTranslation();
  const styles = usePaginationStyles();
  const clampedPage = Math.min(Math.max(page, 1), Math.max(totalPages, 1));
  const { scrollRef, onViewportLayout, onPageLayout } =
    useScrollToActivePage(clampedPage);

  if (totalPages <= 0) {
    return null;
  }

  const isCompact = density === 'compact';
  const items = isCompact
    ? []
    : getPaginationRange(clampedPage, totalPages, Math.max(siblingCount, 0));

  return (
    <Box
      ref={ref}
      accessibilityLabel={t('components.pagination.navigationAriaLabel')}
      lx={lx}
      style={[styles.root, style]}
      {...props}
    >
      <IconButton
        icon={ChevronLeft}
        size='sm'
        appearance='gray'
        disabled={clampedPage <= 1}
        accessibilityLabel={t('components.pagination.previousPageAriaLabel')}
        onPress={() => onPageChange(clampedPage - 1)}
      />
      {isCompact && (
        <Text
          accessibilityLiveRegion='polite'
          numberOfLines={1}
          style={styles.pageOfTotal}
        >
          {t('components.pagination.pageOfTotal', {
            current: clampedPage,
            total: totalPages,
          })}
        </Text>
      )}
      {!isCompact && (
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          onLayout={onViewportLayout}
        >
          {items.map((item, index) => {
            if (item === 'ellipsis') {
              return (
                <Box
                  key={`ellipsis-${index}`}
                  importantForAccessibility='no-hide-descendants'
                  accessibilityElementsHidden
                  style={styles.ellipsis}
                >
                  <Text style={styles.ellipsisText}>…</Text>
                </Box>
              );
            }

            const isActive = item === clampedPage;

            return (
              <Button
                key={item}
                size='sm'
                appearance={isActive ? 'gray' : 'no-background'}
                accessibilityLabel={t('components.pagination.pageAriaLabel', {
                  page: item,
                })}
                accessibilityState={{ selected: isActive }}
                onLayout={(event) => onPageLayout(item, event)}
                onPress={() => onPageChange(item)}
              >
                {item}
              </Button>
            );
          })}
        </ScrollView>
      )}
      <IconButton
        icon={ChevronRight}
        size='sm'
        appearance='gray'
        disabled={clampedPage >= totalPages}
        accessibilityLabel={t('components.pagination.nextPageAriaLabel')}
        onPress={() => onPageChange(clampedPage + 1)}
      />
    </Box>
  );
};
