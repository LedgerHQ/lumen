import {
  avatarDotIconSizeMap,
  mediaImageDotIconSizeMap,
  spotDotIconSizeMap,
} from './DotIcon';

type ContextSizeMap = {
  avatar: keyof typeof avatarDotIconSizeMap;
  mediaImage: keyof typeof mediaImageDotIconSizeMap;
  spot: keyof typeof spotDotIconSizeMap;
};

type ContextResultMap = {
  avatar: (typeof avatarDotIconSizeMap)[ContextSizeMap['avatar']];
  mediaImage: (typeof mediaImageDotIconSizeMap)[ContextSizeMap['mediaImage']];
  spot: (typeof spotDotIconSizeMap)[ContextSizeMap['spot']];
};

export type DotIconSizeContext = keyof ContextSizeMap;

const dotIconSizeByContext: {
  [T in DotIconSizeContext]: (size: ContextSizeMap[T]) => ContextResultMap[T];
} = {
  avatar: (size) => avatarDotIconSizeMap[size],
  mediaImage: (size) => mediaImageDotIconSizeMap[size],
  spot: (size) => spotDotIconSizeMap[size],
};

export function getDotIconSize<T extends DotIconSizeContext>(
  context: T,
  size: ContextSizeMap[T],
): ContextResultMap[T] {
  return (
    dotIconSizeByContext[context] as (
      size: ContextSizeMap[T],
    ) => ContextResultMap[T]
  )(size);
}
