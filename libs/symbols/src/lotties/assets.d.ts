// Bundlers resolve `.lottie` files as assets: a module id on Metro, a URL on web.
declare module '*.lottie' {
  const source: number | string;
  // eslint-disable-next-line import/no-default-export -- asset imports are default-only
  export default source;
}
