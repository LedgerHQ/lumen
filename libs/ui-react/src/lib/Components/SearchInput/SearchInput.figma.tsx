import React from 'react';
import { SearchInput } from './SearchInput';

import figma from '@figma/code-connect';

figma.connect(
  SearchInput,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=2248%3A3468',
  {
    imports: ["import { SearchInput } from '@ledgerhq/lumen-ui-react'"],
    props: {
      appearance: figma.enum('appearance', {
        plain: 'plain',
        transparent: 'transparent',
      }),
      placeholder: figma.enum('search-state', {
        placeholder: figma.string('label'),
      }),
      value: figma.enum('search-state', {
        typing: 'Search text',
      }),
      disabled: figma.enum('state', {
        disabled: true,
      }),
    },
    example: (props) => (
      <SearchInput
        appearance={props.appearance}
        placeholder={props.placeholder}
        value={props.value}
        disabled={props.disabled}
      />
    ),
  },
);
