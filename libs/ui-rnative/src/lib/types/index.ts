import React from 'react';
import type { Pressable, View } from 'react-native';

type ComponentPropsWithAsChild<T extends React.ElementType<any>> =
  React.ComponentPropsWithRef<T> & { asChild?: boolean };

type SlottableViewProps = ComponentPropsWithAsChild<typeof View>;
type ViewRef = React.ElementRef<typeof View>;
type PressableRef = React.ElementRef<typeof Pressable>;

type SlottablePressableProps = ComponentPropsWithAsChild<typeof Pressable> & {
  /**
   * Platform: WEB ONLY
   */
  onKeyDown?: (ev: React.KeyboardEvent) => void;
  /**
   * Platform: WEB ONLY
   */
  onKeyUp?: (ev: React.KeyboardEvent) => void;
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
