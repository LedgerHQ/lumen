import figma from '@figma/code-connect';
import {
  DescriptionItem,
  DescriptionItemLabel,
  DescriptionItemLeading,
  DescriptionItemTrailing,
  DescriptionItemValue,
} from './DescriptionItem';

figma.connect(
  DescriptionItem,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=10311-11837',
  {
    imports: [
      "import { DescriptionItem, DescriptionItemLeading, DescriptionItemLabel, DescriptionItemTrailing, DescriptionItemValue } from '@ledgerhq/lumen-ui-react'",
    ],
    props: {
      size: figma.enum('size', {
        sm: 'sm',
        md: 'md',
      }),
      label: figma.string('leading-label'),
      value: figma.string('trailing-label'),
    },
    example: (props) => (
      <DescriptionItem size={props.size}>
        <DescriptionItemLeading>
          <DescriptionItemLabel>{props.label}</DescriptionItemLabel>
        </DescriptionItemLeading>
        <DescriptionItemTrailing>
          <DescriptionItemValue>{props.value}</DescriptionItemValue>
        </DescriptionItemTrailing>
      </DescriptionItem>
    ),
  },
);
