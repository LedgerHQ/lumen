import figma from '@figma/code-connect';
import { Button } from '../Button';
import { BottomSheet } from './BottomSheet';
import { BottomSheetHeader } from './BottomSheetHeader';
import { BottomSheetView } from './Scrollables';

figma.connect(
  BottomSheet,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=118-1734',
  {
    imports: [
      "import { BottomSheet, BottomSheetHeader, BottomSheetView, useBottomSheetRef } from '@ledgerhq/lumen-ui-rnative'",
      "import { Button } from '@ledgerhq/lumen-ui-rnative'",
    ],
    props: {
      header: figma.nestedProps('.bottom-sheet-header', {
        density: figma.enum('appearance', {
          compact: 'compact',
          expanded: 'expanded',
        }),
        title: figma.boolean('show-title', {
          true: figma.string('title'),
          false: undefined,
        }),
        description: figma.boolean('show-description', {
          true: figma.string('description'),
          false: undefined,
        }),
        onBack: figma.boolean('show-back-icon', {
          true: () => {},
          false: undefined,
        }),
      }),
    },
    example: (props) => {
      return (
        <BottomSheet onBack={props.header.onBack}>
          <BottomSheetHeader
            density={props.header.density}
            title={props.header.title}
            description={props.header.description}
          />
          <BottomSheetView>
            <Button appearance='base' isFull onPress={() => {}}>
              Confirm
            </Button>
          </BottomSheetView>
        </BottomSheet>
      );
    },
  },
);
