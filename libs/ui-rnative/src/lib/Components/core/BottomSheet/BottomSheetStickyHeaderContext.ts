import { createSafeContext } from '@ledgerhq/lumen-utils-shared';

// Lives in its own module so BottomSheetHeader can read it without importing Scrollables (which imports the header).
export const [
  BottomSheetStickyHeaderProvider,
  useBottomSheetStickyHeaderContext,
] = createSafeContext<{ isSticky: boolean }>('BottomSheetStickyHeader', {
  isSticky: false,
});
