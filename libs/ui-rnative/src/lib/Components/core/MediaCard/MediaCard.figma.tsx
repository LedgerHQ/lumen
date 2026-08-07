import figma from '@figma/code-connect';
import { Tag } from '../Tag';
import { MediaCard, MediaCardTitle } from './MediaCard';

figma.connect(
  MediaCard,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=15160-2853',
  {
    imports: [
      "import { MediaCard, MediaCardTitle } from '@ledgerhq/lumen-ui-rnative'",
      "import { Tag } from '@ledgerhq/lumen-ui-rnative'",
    ],
    props: {
      title: figma.string('title'),
      tag: figma.boolean('show-tag', {
        true: <Tag label='Label' appearance='base' />,
        false: undefined,
      }),
    },
    example: (props) => (
      <MediaCard imageUrl='/image.jpg' onPress={() => {}} onClose={() => {}}>
        {props.tag}
        <MediaCardTitle>{props.title}</MediaCardTitle>
      </MediaCard>
    ),
  },
);
