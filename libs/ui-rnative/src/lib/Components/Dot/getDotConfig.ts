export type DotConfigMap<Size extends string, Props> = Record<Size, Props>;
export type DotContextConfigMap = Record<string, DotConfigMap<string, unknown>>;

export function createGetDotConfig<T extends DotContextConfigMap>(config: T) {
  return function getDotConfig<
    Context extends keyof T,
    Size extends keyof T[Context],
  >(context: Context, size: Size) {
    return config[context][size];
  };
}
