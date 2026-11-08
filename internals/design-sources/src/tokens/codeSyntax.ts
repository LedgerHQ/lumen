/**
 * What Dev Mode shows per platform: the CSS variable on web, the `t.*` theme
 * path on iOS and Android (React Native) when the token is on the theme.
 */
export type CodeSyntax = { WEB: string; iOS?: string; ANDROID?: string };

/**
 * The file design-build writes and sync-figma uploads: Figma collection
 * (`2.theme`) → variable name (`color/background/canvas/default`) → code
 * syntax. Declared here, the one stage both of them import.
 */
export type CodeSyntaxFile = Record<string, Record<string, CodeSyntax>>;
