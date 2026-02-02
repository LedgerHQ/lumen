import React from 'react';
import { Tag } from './Tag';
import { TagProps } from './types';

import figma from '@figma/code-connect';

figma.connect(
  Tag,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=722%3A5547',
  {
    imports: ["import { Tag } from '@ledgerhq/lumen-ui-react'"],
    props: {
      label: figma.string('label'),
      appearance: figma.enum('appearance', {
        base: 'base',
        gray: 'gray',
        accent: 'accent',
        success: 'success',
        error: 'error',
        warning: 'warning',
      }),
      size: figma.enum('size', {
        md: 'md',
        sm: 'sm',
      }),
      showicon: figma.boolean('show-icon'),
      icon: figma.instance('icon'),
      disabled: figma.enum('appearance', {
        disabled: true,
      })
    },
    example: (props: Omit<TagProps, 'icon'> & {
      icon: any,
    }) => (
      <Tag
        disabled={props.disabled}
        label={props.label}
        appearance={props.appearance}
        size={props.size}
        icon={props.icon}
      />
    ),
  },
);
