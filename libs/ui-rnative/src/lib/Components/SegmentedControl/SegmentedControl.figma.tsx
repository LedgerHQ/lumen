import figma from '@figma/code-connect';
import { SegmentedControl, SegmentedControlButton } from './SegmentedControl';

figma.connect(
  SegmentedControl,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=1170-2345',
  {
    imports: [
      "import { SegmentedControl, SegmentedControlButton } from '@ledgerhq/lumen-ui-rnative'",
    ],
    props: {
      appearance: figma.enum('appearance', {
        background: 'background',
        'no-background': 'no-background',
      }),
      tabLayout: figma.enum('tab-width', {
        fixed: 'fixed',
        hug: 'fit',
      }),
    },
    example: (props) => (
      <SegmentedControl
        selectedValue='tab1'
        onSelectedChange={() => {}}
        appearance={props.appearance}
        tabLayout={props.tabLayout}
      >
        <SegmentedControlButton value='tab1'>Tab 1</SegmentedControlButton>
        <SegmentedControlButton value='tab2'>Tab 2</SegmentedControlButton>
        <SegmentedControlButton value='tab3'>Tab 3</SegmentedControlButton>
      </SegmentedControl>
    ),
  },
);
