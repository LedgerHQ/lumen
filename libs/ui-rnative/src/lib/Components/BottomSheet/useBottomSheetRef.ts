import { BottomSheetModal as GorhomBottomSheetModal } from '@gorhom/bottom-sheet';
import { useRef } from 'react';

export const useBottomSheetRef = () => {
  const bottomSheetRef = useRef<GorhomBottomSheetModal>(null);

  return bottomSheetRef;
};

export { useBottomSheet } from '@gorhom/bottom-sheet';
