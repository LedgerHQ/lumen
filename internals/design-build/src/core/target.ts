/** One generated file, its path relative to the target's `outDir`. */
export type OutputFile = { path: string; contents: string };

/**
 * The output contract. `emit` is a pure function of the model: no file system,
 * no network. It may be async, so a target can call an async tool.
 */
export type Target<Model> = {
  /** `css`, `js`, `tailwind`… */
  name: string;
  /** Workspace-relative folder the target owns entirely: files it stops emitting are deleted. */
  outDir: string;
  emit(model: Model): OutputFile[] | Promise<OutputFile[]>;
};
