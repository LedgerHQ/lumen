import { mediaImageDotIconSizeMap, spotDotIconSizeMap } from './DotIcon';
import type { DotIconSize } from './types';

type ContextSizeMap = {
  mediaImage: keyof typeof mediaImageDotIconSizeMap;
  spot: keyof typeof spotDotIconSizeMap;
};

export type DotIconSizeContext = keyof ContextSizeMap;

const dotIconSizeByContext: {
  [T in DotIconSizeContext]: (size: ContextSizeMap[T]) => DotIconSize;
} = {
  mediaImage: (size) => mediaImageDotIconSizeMap[size],
  spot: (size) => spotDotIconSizeMap[size],
};

export function getDotIconSize<T extends DotIconSizeContext>(
  context: T,
  size: ContextSizeMap[T],
): DotIconSize {
  return dotIconSizeByContext[context](size);
}
