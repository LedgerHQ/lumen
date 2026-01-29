import {
  ComponentRef,
  isValidElement,
  cloneElement,
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
} from 'react';
import {
  View,
  Pressable,
  Text,
  Image,
  PressableProps,
  ViewProps,
  TextProps,
  ImageProps,
  StyleProp,
  StyleSheet,
  PressableStateCallbackType,
  ImageStyle as RNImageStyle,
} from 'react-native';

const SlotPressable = ({
  ref,
  ...props
}: PressableProps & ComponentPropsWithRef<typeof Pressable>) => {
  const { children, ...pressableSlotProps } = props;

  if (!isValidElement(children)) {
    console.error('Slot.Pressable - Invalid asChild element', children);
    return null;
  }

  return cloneElement<
    ComponentPropsWithoutRef<typeof Pressable>,
    ComponentRef<typeof Pressable>
  >(isTextChildren(children) ? <></> : children, {
    ...mergeProps(pressableSlotProps, children.props as AnyProps),
    ref: ref ? composeRefs(ref, (children as any).ref) : (children as any).ref,
  });
};

SlotPressable.displayName = 'SlotPressable';

const SlotView = ({
  ref,
  ...props
}: ViewProps & ComponentPropsWithRef<typeof View>) => {
  const { children, ...viewSlotProps } = props;

  if (!isValidElement(children)) {
    console.error('Slot.View - Invalid asChild element', children);
    return null;
  }

  return cloneElement<
    React.ComponentPropsWithoutRef<typeof View>,
    ComponentRef<typeof View>
  >(isTextChildren(children) ? <></> : children, {
    ...mergeProps(viewSlotProps, children.props as AnyProps),
    ref: ref ? composeRefs(ref, (children as any).ref) : (children as any).ref,
  });
};

SlotView.displayName = 'SlotView';

const SlotText = ({
  ref,
  ...props
}: TextProps & ComponentPropsWithRef<typeof Text>) => {
  const { children, ...textSlotProps } = props;

  if (!isValidElement(children)) {
    console.error('Slot.Text - Invalid asChild element', children);
    return null;
  }

  return cloneElement<
    React.ComponentPropsWithoutRef<typeof Text>,
    ComponentRef<typeof Text>
  >(isTextChildren(children) ? <></> : children, {
    ...mergeProps(textSlotProps, children.props as AnyProps),
    ref: ref ? composeRefs(ref, (children as any).ref) : (children as any).ref,
  });
};

SlotText.displayName = 'SlotText';

type SlotImageSlotProps = ImageProps & {
  children?: React.ReactNode;
} & ComponentPropsWithRef<typeof Image>;

const SlotImage = ({ ref, ...props }: SlotImageSlotProps) => {
  const { children, ...imageSlotProps } = props;

  if (!isValidElement(children)) {
    console.error('Slot.Image - Invalid asChild element', children);
    return null;
  }

  return cloneElement<
    React.ComponentPropsWithoutRef<typeof Image>,
    ComponentRef<typeof Image>
  >(isTextChildren(children) ? <></> : children, {
    ...mergeProps(imageSlotProps, children.props as AnyProps),
    ref: ref ? composeRefs(ref, (children as any).ref) : (children as any).ref,
  });
};

SlotImage.displayName = 'SlotImage';

function composeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (node: T) =>
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref != null) {
        (ref as React.MutableRefObject<T>).current = node;
      }
    });
}

type AnyProps = Record<string, any>;

function mergeProps(slotProps: AnyProps, childProps: AnyProps) {
  // all child props should override
  const overrideProps = { ...childProps };

  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];

    const isHandler = /^on[A-Z]/.test(propName);
    if (isHandler) {
      // if the handler exists on both, we compose them
      if (slotPropValue && childPropValue) {
        overrideProps[propName] = (...args: unknown[]) => {
          childPropValue(...args);
          slotPropValue(...args);
        };
      }
      // but if it exists only on the slot, we use only this one
      else if (slotPropValue) {
        overrideProps[propName] = slotPropValue;
      }
    }
    // if it's `style`, we merge them
    else if (propName === 'style') {
      overrideProps[propName] = combineStyles(slotPropValue, childPropValue);
    }
  }

  return { ...slotProps, ...overrideProps };
}

type PressableStyle = PressableProps['style'];
type ImageStyle = StyleProp<RNImageStyle>;
type Style = PressableStyle | ImageStyle;

function combineStyles(slotStyle?: Style, childValue?: Style) {
  if (typeof slotStyle === 'function' && typeof childValue === 'function') {
    return (state: PressableStateCallbackType) => {
      return StyleSheet.flatten([slotStyle(state), childValue(state)]);
    };
  }
  if (typeof slotStyle === 'function') {
    return (state: PressableStateCallbackType) => {
      return childValue
        ? StyleSheet.flatten([slotStyle(state), childValue])
        : slotStyle(state);
    };
  }
  if (typeof childValue === 'function') {
    return (state: PressableStateCallbackType) => {
      return slotStyle
        ? StyleSheet.flatten([slotStyle, childValue(state)])
        : childValue(state);
    };
  }

  return StyleSheet.flatten([slotStyle, childValue].filter(Boolean));
}

export function isTextChildren(
  children:
    | React.ReactNode
    | ((state: PressableStateCallbackType) => React.ReactNode),
) {
  return Array.isArray(children)
    ? children.every((child) => typeof child === 'string')
    : typeof children === 'string';
}

export { SlotImage, SlotPressable, SlotText, SlotView };
