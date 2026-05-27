import type { ElementType, ComponentPropsWithRef, ComponentRef } from 'react';
import type { Pressable, View } from 'react-native';

type ComponentPropsWithAsChild<T extends ElementType<any>> =
  ComponentPropsWithRef<T> & { asChild?: boolean };

type SlottableViewProps = ComponentPropsWithAsChild<typeof View>;
type ViewRef = ComponentRef<typeof View>;
type PressableRef = ComponentRef<typeof Pressable>;

type SlottablePressableProps = ComponentPropsWithAsChild<typeof Pressable> & {
  /**
   * Platform: WEB ONLY
   */
  onKeyDown?: (ev: KeyboardEvent) => void;
  /**
   * Platform: WEB ONLY
   */
  onKeyUp?: (ev: KeyboardEvent) => void;
};

type ForceMountable = {
  forceMount?: true | undefined;
};

export type {
  ForceMountable,
  PressableRef,
  SlottablePressableProps,
  SlottableViewProps,
  ViewRef,
};
