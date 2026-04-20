import type { PropsWithChildren, ReactElement } from 'react';
import { cloneElement, isValidElement, memo } from 'react';
import type { ImageStyle, StyleProp, TextStyle, ViewStyle } from 'react-native';

type StyleValue = ViewStyle | TextStyle | ImageStyle;

type StylableProps = { style?: StyleProp<StyleValue> };

export const InjectStylesIntoChildren = memo(
  ({ style, children }: PropsWithChildren<{ style: StyleValue }>) => {
    if (!isValidElement(children)) {
      return children;
    }
    const childProps = children.props as StylableProps;
    return cloneElement(children as ReactElement<StylableProps>, {
      style: childProps.style ? [childProps.style, style] : style,
    });
  },
);
InjectStylesIntoChildren.displayName = 'InjectStylesIntoChildren';
