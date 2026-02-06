import {
  BottomSheetModal as GorhomBottomSheetModal,
  BottomSheetView as GorhomBottomSheetView,
  BottomSheetFlatList as GorhomBottomSheetFlatList,
  BottomSheetSectionList as GorhomBottomSheetSectionList,
  BottomSheetScrollView as GorhomBottomSheetScrollView,
  BottomSheetVirtualizedList as GorhomBottomSheetVirtualizedList,
} from '@gorhom/bottom-sheet';

import { PropsWithChildren, ReactNode, Ref } from 'react';
import { StyledViewProps } from '../../../styles';
export type BottomSheetProps = PropsWithChildren & {
  /**
   * Ref to the bottom sheet component.
   */
  ref?: Ref<React.ElementRef<typeof GorhomBottomSheetModal>>;
  /**
   * Used to locate this view in end-to-end tests.
   */
  testID?: string;
  /**
   * The snap points represent allowed heights of the bottom sheet.
   * You can use presets like 'full', 'medium', 'small' or define your own snap points in % (string) or pixel (number).
   * This prop is required when enableDynamicSizing is false.
   * @default 'fullWithOffset'
   */
  snapPoints?:
    | 'full'
    | 'fullWithOffset'
    | 'medium'
    | 'small'
    | string[]
    | number[]
    | null;
  /**
   * If true, the bottom sheet will be resized to fit the content.
   * Setting this prop to true, will result in adding a new snap point to the provided snap points and will be sorted accordingly,
   * if provided snap points are [100, 1000], and the content size is 500 then the final snap points will be [100, 500, 1000].
   * @default false
   */
  enableDynamicSizing?: boolean;
  /**
   * The maximum dynamic content size of the bottom sheet.
   * You should define maxDynamicContentSize when enableDynamicSizing is true.
   * By default, the max dynamic content size is the container height.
   * @default undefined
   */
  maxDynamicContentSize?: 'full' | 'fullWithOffset' | number;
  /**
   * The callback function to handle the change event.
   * The index of the snap point in the array.
   * @default undefined
   */
  onChange?: (index: number, position: number, type: 0 | 1) => void;
  /**
   * The callback function to handle the change event.
   * @default undefined
   */
  onAnimate?: (
    fromIndex: number,
    toIndex: number,
    fromPosition: number,
    toPosition: number,
  ) => void;
  /**
   * The callback function to handle the back event.
   */
  onBack?: () => void;
  /**
   * If true, the close button will be hidden.
   * @default false
   */
  hideCloseButton?: boolean;
  /**
   * Callback function to handle the close event.
   * @default undefined
   */
  onClose?: () => void;
  /**
   * Callback function to handle the open event.
   * @default undefined
   */
  onOpen?: () => void;
  /**
   * If true, the backdrop will be hidden.
   * @default false
   */
  hideBackdrop?: boolean;
  /**
   * The behavior of the backdrop press event.
   * You can defined an index to snap to when the backdrop is pressed.
   * @default 'close'
   */
  backdropPressBehavior?: 'none' | 'close' | number;
  /**
   * The callback function to handle the backdrop press event.
   * @default undefined
   */
  onBackdropPress?: () => void;
  /**
   * Whether to enable handle panning gesture.
   * If true, the whole sheet area can be dragged to resize the sheet.
   * @default false
   */
  enableHandlePanningGesture?: boolean;
  /**
   * Whether to enable pan down to close.
   * If true, the sheet can be closed by dragging down.
   * @default true
   */
  enablePanDownToClose?: boolean;
  /**
   * Defines whether the bottom sheet is attached to the bottom or no.
   * @default false
   */
  detached?: boolean;
  /**
   * Whether to enable blur keyboard on gesture.
   * If true, the keyboard will be blurred when the user interacts with the bottom sheet.
   * @default true
   */
  enableBlurKeyboardOnGesture?: boolean;
};

export type BottomSheetHeaderProps = {
  /**
   * The appearance of the header.
   * @default 'compact'
   */
  appearance?: 'compact' | 'expanded';
  /**
   * The title of the header.
   */
  title?: ReactNode;
  /**
   * The description of the header.
   */
  description?: ReactNode;
  /**
   * Add spacing when used with virtual lists or section lists.
   * For these cases, spacing is needed because the header can't be wrapped on a BottomSheetView
   * @default false
   */
  spacing?: boolean;
} & Omit<StyledViewProps, 'children'>;

export type BottomSheetViewProps = Parameters<typeof GorhomBottomSheetView>[0];
export type BottomSheetFlatListProps = Parameters<
  typeof GorhomBottomSheetFlatList
>[0];
export type BottomSheetSectionListProps = Parameters<
  typeof GorhomBottomSheetSectionList
>[0];
export type BottomSheetScrollViewProps = Parameters<
  typeof GorhomBottomSheetScrollView
>[0];
export type BottomSheetVirtualizedListProps = Parameters<
  typeof GorhomBottomSheetVirtualizedList
>[0];
