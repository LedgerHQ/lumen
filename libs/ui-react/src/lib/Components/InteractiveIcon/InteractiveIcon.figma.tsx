import figma from '@figma/code-connect';
import React from 'react';
import { InteractiveIcon } from './InteractiveIcon';
import { InteractiveIconProps } from './types';

const URL =
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=6975-2571';

const sharedProps = {
  iconType: figma.enum('appearance', {
    filled: 'filled',
    stroked: 'stroked',
  }),
  appearance: figma.enum('color', {
    muted: 'muted',
    white: 'white',
    base: 'base',
  }),
  disabled: figma.enum('state', {
    disabled: true,
  }),
};

const example = (props: InteractiveIconProps) => (
  <InteractiveIcon
    iconType={props.iconType}
    appearance={props.appearance}
    disabled={props.disabled}
    aria-label='Interactive icon'
  >
    {props.children}
  </InteractiveIcon>
);

figma.connect(InteractiveIcon, URL, {
  variant: { appearance: 'filled' },
  imports: ["import { InteractiveIcon } from '@ledgerhq/lumen-ui-react'"],
  props: { ...sharedProps, children: figma.instance('icon-filled') },
  example,
});

figma.connect(InteractiveIcon, URL, {
  variant: { appearance: 'stroked' },
  imports: ["import { InteractiveIcon } from '@ledgerhq/lumen-ui-react'"],
  props: { ...sharedProps, children: figma.instance('icon-stroked') },
  example,
});
