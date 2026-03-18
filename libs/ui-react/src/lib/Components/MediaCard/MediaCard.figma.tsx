import React from 'react';
import { MediaCard, MediaCardTitle } from './MediaCard';
import { Tag } from '../Tag/Tag';

import figma from '@figma/code-connect';

figma.connect(
  MediaCard,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=15160-2853',
  {
    imports: [
      "import { MediaCard, MediaCardTitle } from '@ledgerhq/lumen-ui-react'",
      "import { Tag } from '@ledgerhq/lumen-ui-react'",
    ],
    props: {
      text: figma.string('title'),
      tag: figma.boolean('show-tag', {
        true: <Tag label='Label' appearance='base' />,
        false: undefined,
      }),
    },
    example: (props) => (
      <MediaCard
        imageUrl='/image.jpg'
        onClick={() => {}}
        onClose={() => {}}
      >
        {props.tag}
        <MediaCardTitle>{props.text}</MediaCardTitle>
      </MediaCard>
    ),
  },
);
