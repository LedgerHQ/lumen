// oxlint loads a plugin file with a plain `import()`. Going through a file of
// ours means Node resolves the dependency from this package's real location,
// which also works under pnpm's strict layout, where oxlint's own resolver
// would look in the consumer's `node_modules` and fail.
// eslint-disable-next-line import/no-default-export
export { default } from 'eslint-plugin-better-tailwindcss';
