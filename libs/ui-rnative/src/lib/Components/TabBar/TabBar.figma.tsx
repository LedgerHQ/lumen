import figma from '@figma/code-connect';
import { Placeholder } from '../../Symbols';
import { TabBar, TabBarItem } from './TabBar';

figma.connect(
  TabBar,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=10804-1045',
  {
    imports: [
      "import { TabBar, TabBarItem } from '@ledgerhq/lumen-ui-rnative'",
      "import { Placeholder } from '@ledgerhq/lumen-ui-rnative/symbols'",
    ],
    props: {
      items: figma.enum('nb-tabs', {
        '2': (
          <>
            <TabBarItem value='tab1' label='Label1' icon={Placeholder} />
            <TabBarItem value='tab2' label='Label2' icon={Placeholder} />
          </>
        ),
        '3': (
          <>
            <TabBarItem value='tab1' label='Label1' icon={Placeholder} />
            <TabBarItem value='tab2' label='Label2' icon={Placeholder} />
            <TabBarItem value='tab3' label='Label3' icon={Placeholder} />
          </>
        ),
        '4': (
          <>
            <TabBarItem value='tab1' label='Label1' icon={Placeholder} />
            <TabBarItem value='tab2' label='Label2' icon={Placeholder} />
            <TabBarItem value='tab3' label='Label3' icon={Placeholder} />
            <TabBarItem value='tab4' label='Label4' icon={Placeholder} />
          </>
        ),
        '5': (
          <>
            <TabBarItem value='tab1' label='Label1' icon={Placeholder} />
            <TabBarItem value='tab2' label='Label2' icon={Placeholder} />
            <TabBarItem value='tab3' label='Label3' icon={Placeholder} />
            <TabBarItem value='tab4' label='Label4' icon={Placeholder} />
            <TabBarItem value='tab5' label='Label5' icon={Placeholder} />
          </>
        ),
      }),
    },
    example: (props) => (
      <TabBar active='tab1' onTabPress={() => {}}>
        {props.items}
      </TabBar>
    ),
  },
);

figma.connect(
  TabBarItem,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=10804-913',
  {
    imports: [
      "import { TabBarItem } from '@ledgerhq/lumen-ui-rnative'",
      "import { Placeholder } from '@ledgerhq/lumen-ui-rnative/symbols'",
    ],
    props: {
      label: figma.textContent('Label'),
    },
    example: (props) => (
      <TabBarItem value='tab1' label={props.label} icon={Placeholder} />
    ),
  },
);
