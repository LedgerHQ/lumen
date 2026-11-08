import type { FigmaClient } from '../client/figmaClient.js';
import { codeSyntaxUpdateBody } from './codeSyntaxBody.js';

/** Sets each variable's Dev Mode code syntax to the CSS variable it builds to. */
export const uploadCodeSyntax = async (
  client: FigmaClient,
  fileKey: string,
): Promise<void> => {
  const localVariables = await client.getLocalVariables(fileKey);
  const body = codeSyntaxUpdateBody(localVariables);

  if (!body.variables?.length) {
    console.log('Code Syntax: No variables to update');
    return;
  }

  console.log(`Code Syntax: Updating ${body.variables.length} variables...`);
  await client.postVariables(fileKey, body);
};
