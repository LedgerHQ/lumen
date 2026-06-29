import {
  avatarDotIconSizeMap,
  mediaImageDotIconSizeMap,
  spotDotIconSizeMap,
} from './DotIcon';

type ContextSizeMap = {
  mediaImage: keyof typeof mediaImageDotIconSizeMap;
  spot: keyof typeof spotDotIconSizeMap;
  avatar: keyof typeof avatarDotIconSizeMap;
};

type ContextResultMap = {
  mediaImage: (typeof mediaImageDotIconSizeMap)[ContextSizeMap['mediaImage']];
  spot: (typeof spotDotIconSizeMap)[ContextSizeMap['spot']];
  avatar: (typeof avatarDotIconSizeMap)[ContextSizeMap['avatar']];
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
