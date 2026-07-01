import { avatarDotConfigMap } from './constants';

type ContextConfigMap = {
  avatar: keyof typeof avatarDotConfigMap;
};

type ContextResultMap = {
  avatar: (typeof avatarDotConfigMap)[ContextConfigMap['avatar']];
};

type DotConfigContext = keyof ContextConfigMap;

const dotConfigByContext: {
  [T in DotConfigContext]: (size: ContextConfigMap[T]) => ContextResultMap[T];
} = {
  avatar: (size) => avatarDotConfigMap[size],
};

export function getDotConfig<T extends DotConfigContext>(
  context: T,
  size: ContextConfigMap[T],
): ContextResultMap[T] {
  return (
    dotConfigByContext[context] as (
      size: ContextConfigMap[T],
    ) => ContextResultMap[T]
  )(size);
}
