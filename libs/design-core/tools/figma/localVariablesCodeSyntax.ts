import {
  LocalVariable,
  GetLocalVariablesResponse,
  PostVariablesRequestBody,
  VariableUpdate,
} from '@figma/rest-api-spec';

export function findVariablesEndingByDefault(
  variables: LocalVariable[],
): LocalVariable[] {
  return variables.filter((variable) =>
    variable.name.toLowerCase().endsWith('/default'),
  );
}

export function codeSyntaxFromVariableNameEndingByDefault(
  name: string,
): string {
  let cssVariableName = name.toLowerCase();
  while (cssVariableName.endsWith('/default')) {
    cssVariableName = cssVariableName.replace(/\/default$/, '');
  }
  cssVariableName = cssVariableName.replace(/\//g, '-').replace(/\s/g, '-');

  return `var(--${cssVariableName});`;
}

export default function codeSyntaxUpdateBody(
  localVariables: GetLocalVariablesResponse,
): PostVariablesRequestBody {
  const variablesChange: VariableUpdate[] = findVariablesEndingByDefault(
    Object.values(localVariables.meta.variables),
  )
    .filter(
      (variable) =>
        variable.codeSyntax?.WEB !==
        codeSyntaxFromVariableNameEndingByDefault(variable.name),
    )
    .map((variable) => {
      return {
        id: variable.id,
        name: variable.name,
        codeSyntax: {
          WEB: codeSyntaxFromVariableNameEndingByDefault(variable.name),
        },
        action: 'UPDATE',
      };
    });
  return {
    variables: variablesChange,
  };
}
