declare namespace NodeJS {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Require {
    context(
      path: string,
      recursive?: boolean,
      filter?: RegExp,
    ): {
      keys(): string[];
      (id: string): unknown;
    };
  }
}
