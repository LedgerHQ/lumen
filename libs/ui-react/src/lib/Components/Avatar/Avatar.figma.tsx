import React from "react";
import { Avatar } from './Avatar'

import figma from '@figma/code-connect';

figma.connect(
  Avatar,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=11097-8',
  {
    imports: ["import { Avatar } from '@ledgerhq/lumen-ui-react'"],
    props: {
      size: figma.enum('size', {
        sm: 'sm',
        md: 'md',
      }),
      showNotification: figma.boolean('show-notification', {
        true: true,
        false: false,
      }),
    },
    example: (props) => (
      <Avatar src="https://example-image.com" size={props.size} alt="John Doe's Avatar" showNotification={props.showNotification} />
    )
  }
)