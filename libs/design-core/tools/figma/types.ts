/**
 * This file is based on gerard-figma's project: https://github.com/gerard-figma/figma-variables-to-styledictionary/
 * which is released under the MIT license.
 * Copyright 2013 gerard-figma
 */

import { VariableCodeSyntax, VariableScope } from '@figma/rest-api-spec';

export type Token = {
  $type: 'color' | 'number' | 'string' | 'boolean';
  $value: string | number | boolean;
  $description?: string;
  $extensions?: {
    'com.figma'?: {
      hiddenFromPublishing?: boolean;
      scopes?: VariableScope[];
      codeSyntax?: VariableCodeSyntax;
    };
  };
};

type TokenOrTokenGroup =
  | Token
  | ({
      [tokenName: string]: Token;
    } & { $type?: never; $value?: never });

export type TokenFileContent = {
  [key: string]: TokenOrTokenGroup;
};

export type LocalVariableCollectionMode = {
  modeId: string;
  name: string;
};
