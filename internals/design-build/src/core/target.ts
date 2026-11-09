/** One generated file, its path relative to the target's `outDir`. */
export type OutputFile = { path: string; contents: string };

/**
 * The output contract. `emit` is a pure function of the model: no file system,
 * no network. It may be async only because svgr is.
 */
export type Target<Model> = {
  /** `css`, `js`, `tailwind`, `react-symbols`… */
  name: string;
  /** Workspace-relative folder the target writes to. */
  outDir: string;
  emit(model: Model): OutputFile[] | Promise<OutputFile[]>;
  /**
   * Which files under `outDir` the target owns, by relative path: owned files
   * it stops emitting are deleted. Defaults to the whole folder; narrow it when
   * hand-written files share the folder.
   */
  owns?: (relativePath: string) => boolean;
  /** Run prettier on the output (default). Off for files kept byte for byte, such as SVGs. */
  format?: boolean;
};
