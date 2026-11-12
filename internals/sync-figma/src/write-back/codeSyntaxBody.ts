import type {
  GetLocalVariablesResponse,
  PostVariablesRequestBody,
  VariableUpdate,
} from '@figma/rest-api-spec';

type Platform = 'WEB' | 'iOS' | 'ANDROID';

/**
 * The file design-build writes: Figma collection → variable name → code
 * syntax per platform. Read by path, so this project never imports the build.
 */
export type CodeSyntaxFile = Record<
  string,
  Record<string, Partial<Record<Platform, string>>>
>;

/**
 * The variables whose Dev Mode code syntax differs from what the build names
 * them, on any platform. Variables the file doesn't list (icon sizes, motion)
 * are left alone.
 */
export const codeSyntaxUpdateBody = (
  localVariables: GetLocalVariablesResponse,
  codeSyntax: CodeSyntaxFile,
): PostVariablesRequestBody => {
  const { variables, variableCollections } = localVariables.meta;
  const updates: VariableUpdate[] = [];

  for (const variable of Object.values(variables)) {
    if (variable.remote || variable.deletedButReferenced) continue;
    const collection = variableCollections[variable.variableCollectionId]?.name;
    const wanted = codeSyntax[collection]?.[variable.name];
    if (!wanted) continue;
    const changed = (Object.keys(wanted) as Platform[]).some(
      (platform) => variable.codeSyntax?.[platform] !== wanted[platform],
    );
    if (!changed) continue;
    updates.push({
      id: variable.id,
      action: 'UPDATE',
      codeSyntax: { ...variable.codeSyntax, ...wanted },
    });
  }

  return { variables: updates };
};
