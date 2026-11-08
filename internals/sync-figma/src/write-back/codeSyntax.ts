import type { FigmaClient } from '../client/figmaClient.js';
import { type CodeSyntaxFile, codeSyntaxUpdateBody } from './codeSyntaxBody.js';

/** Uploads the code syntax design-build generated, for the variables that differ. */
export const uploadCodeSyntax = async (
  client: FigmaClient,
  fileKey: string,
  codeSyntax: CodeSyntaxFile,
): Promise<void> => {
  const localVariables = await client.getLocalVariables(fileKey);
  const body = codeSyntaxUpdateBody(localVariables, codeSyntax);

  if (!body.variables?.length) {
    console.log('Code Syntax: No variables to update');
    return;
  }

  console.log(`Code Syntax: Updating ${body.variables.length} variables...`);
  await client.postVariables(fileKey, body);
};
