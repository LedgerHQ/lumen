import figma from '@figma/code-connect';
import { MenuList, MenuListItem } from './MenuList';

figma.connect(
  MenuListItem,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=7897-7037',
  {
    imports: [
      "import { MenuList, MenuListItem } from '@ledgerhq/lumen-ui-rnative'",
    ],
    props: {
      label: figma.string('title'),
      disabled: figma.enum('state', {
        disabled: true,
      }),
    },
    example: (props) => (
      <MenuList>
        <MenuListItem label={props.label} disabled={props.disabled} />
      </MenuList>
    ),
  },
);
