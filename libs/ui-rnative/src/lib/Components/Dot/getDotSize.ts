import {
  avatarDotIconSizeMap,
  mediaImageDotIconSizeMap,
  spotDotIconSizeMap,
} from '../DotIcon';

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

export type DotSizeContext = keyof ContextSizeMap;

const dotSizeByContext: {
  [T in DotSizeContext]: (size: ContextSizeMap[T]) => ContextResultMap[T];
} = {
  avatar: (size) => avatarDotIconSizeMap[size],
  mediaImage: (size) => mediaImageDotIconSizeMap[size],
  spot: (size) => spotDotIconSizeMap[size],
};

export function getDotSize<T extends DotSizeContext>(
  context: T,
  size: ContextSizeMap[T],
): ContextResultMap[T] {
  return (
    dotSizeByContext[context] as (
      size: ContextSizeMap[T],
    ) => ContextResultMap[T]
  )(size);
}
