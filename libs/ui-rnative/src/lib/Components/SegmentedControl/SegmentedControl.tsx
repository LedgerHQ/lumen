import React, { isValidElement, cloneElement } from 'react';
import { Box, Pressable } from '../Utility';
import type {
  SegmentedControlButtonProps,
  SegmentedControlProps,
} from './types';

export function SegmentedControlButton({
  selected,
  children,
  index: _index = 0,
  onPress,
  ...props
}: SegmentedControlButtonProps) {
  return (
    <Pressable onPress={onPress} accessibilityState={{ selected }} {...props}>
      {children}
    </Pressable>
  );
}

SegmentedControlButton.displayName = 'SegmentedControlButton';

export function SegmentedControl({
  onChange,
  accessibilityLabel,
  children,
  ...props
}: SegmentedControlProps) {
  const childrenWithInjections = React.Children.map(
    children,
    (child, index) => {
      if (isValidElement(child) && child.type === SegmentedControlButton) {
        const existingOnPress = (child.props as SegmentedControlButtonProps)
          .onPress;
        return cloneElement(
          child as React.ReactElement<SegmentedControlButtonProps>,
          {
            index,
            onPress: () => {
              onChange(index);
              existingOnPress?.();
            },
          },
        );
      }
      return child;
    },
  );

  return (
    <Box
      accessibilityRole='radiogroup'
      accessibilityLabel={accessibilityLabel}
      {...props}
    >
      {childrenWithInjections}
    </Box>
  );
}

SegmentedControl.displayName = 'SegmentedControl';
