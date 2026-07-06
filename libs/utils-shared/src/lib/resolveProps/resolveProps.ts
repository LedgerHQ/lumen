export type PropsMap<Variant extends string, Props> = Record<Variant, Props>;
export type ContextPropsMap = Record<string, PropsMap<string, unknown>>;

export function createPropsResolver<T extends ContextPropsMap>(config: T) {
  return function resolveProps<
    Context extends keyof T,
    Variant extends keyof T[Context],
  >(context: Context, variant: Variant) {
    return config[context][variant];
  };
}
