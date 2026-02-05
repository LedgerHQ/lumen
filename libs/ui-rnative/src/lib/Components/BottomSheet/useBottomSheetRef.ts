import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useRef } from 'react';

export const useBottomSheetRef = () => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  return bottomSheetRef;
};

export { useBottomSheet } from '@gorhom/bottom-sheet';
