import React, { useCallback, useEffect } from 'react';
import { Pressable } from 'react-native';
import { useStyleSheet } from '../../../styles';
import { Check } from '../../Symbols';
import {
  BottomSheet,
  BottomSheetHeader,
  BottomSheetView,
  useBottomSheetRef,
} from '../BottomSheet';
import { Divider } from '../Divider';
import { Box, Text } from '../Utility';
import { useGlobalSelectSafeContext } from './GlobalSelectContext';

const useStyles = () => {
  return useStyleSheet(
    (t) => ({
      bottomSheetView: {
        paddingHorizontal: t.spacings.s8,
      },
      groupLabel: {
        marginBottom: t.spacings.s4,
        paddingHorizontal: t.spacings.s8,
        paddingTop: t.spacings.s8,
        color: t.colors.text.muted,
        ...t.typographies.body3SemiBold,
      },
      item: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: t.borderRadius.sm,
        padding: t.spacings.s8,
        backgroundColor: t.colors.bg.baseTransparent,
      },
      itemPressed: {
        backgroundColor: t.colors.bg.baseTransparentPressed,
      },
      itemDisabled: {
        opacity: 0.5,
      },
      itemLabel: {
        flex: 1,
        color: t.colors.text.base,
        ...t.typographies.body2,
      },
      itemLabelDisabled: {
        color: t.colors.text.disabled,
      },
    }),
    [],
  );
};

/**
 * BottomSheet component that displays select options.
 * This should be placed at the root level inside GestureHandlerRootView.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/components-select-overview--docs Storybook}
 *
 * @example
 * import { GlobalSelectProvider, GlobalSelectBottomSheet } from '@ledgerhq/lumen-ui-rnative';
 *
 * function App() {
 *   return (
 *     <GestureHandlerRootView>
 *       <YourAppContent />
 *       <GlobalSelectBottomSheet />
 *     </GestureHandlerRootView>
 *   );
 * }
 */
export const GlobalSelectBottomSheet: React.FC = () => {
  const bottomSheetRef = useBottomSheetRef();
  const styles = useStyles();
  /**
   * This is the only component that subscribes to currentSelect
   * All other components use refs to avoid re-renders
   */
  const { currentSelect, hideSelectRef } = useGlobalSelectSafeContext({
    consumerName: 'useGlobalSelectBottomSheetContext',
    contextRequired: true,
  });

  useEffect(() => {
    if (currentSelect) {
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [currentSelect, bottomSheetRef]);

  const handleClose = useCallback(() => {
    currentSelect?.setOpen?.(false);
    hideSelectRef.current();
  }, [hideSelectRef, currentSelect]);

  const handleSelectItem = useCallback(
    (value: string) => {
      if (currentSelect) {
        currentSelect.onSelectValue(value);
        currentSelect.setOpen?.(false);
        hideSelectRef.current();
      }
    },
    [currentSelect, hideSelectRef],
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={null}
      backdropPressBehavior='close'
      onClose={handleClose}
      maxDynamicContentSize='fullWithOffset'
      enableDynamicSizing
      enablePanDownToClose
    >
      <BottomSheetView style={styles.bottomSheetView}>
        {currentSelect && (
          <>
            {currentSelect.label && (
              <BottomSheetHeader
                title={currentSelect.label}
                appearance='compact'
              />
            )}
            <Box lx={{ gap: 's4' }}>
              {currentSelect.items.map((item, index) => {
                if (item.type === 'separator') {
                  return (
                    <Divider
                      key={`separator-${index}`}
                      lx={{ marginVertical: 's4', marginHorizontal: 's8' }}
                    />
                  );
                }
                if (item.type === 'group-label') {
                  return (
                    <Text key={`label-${index}`} style={styles.groupLabel}>
                      {item.label}
                    </Text>
                  );
                }
                const isSelected = currentSelect.selectedValue === item.value;
                return (
                  <Pressable
                    key={item.value}
                    disabled={item.disabled}
                    onPress={() => handleSelectItem(item.value)}
                  >
                    {({ pressed }) => (
                      <Box
                        style={[
                          styles.item,
                          pressed && styles.itemPressed,
                          item.disabled && styles.itemDisabled,
                        ]}
                      >
                        <Text
                          style={[
                            styles.itemLabel,
                            item.disabled && styles.itemLabelDisabled,
                          ]}
                          numberOfLines={1}
                        >
                          {item.label}
                        </Text>
                        {isSelected && <Check size={24} color='active' />}
                      </Box>
                    )}
                  </Pressable>
                );
              })}
            </Box>
          </>
        )}
      </BottomSheetView>
    </BottomSheet>
  );
};
