import figma from '@figma/code-connect';
import { NavBar, NavBarBackButton, NavBarContent, NavBarTitle } from './NavBar';

figma.connect(
  NavBar,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=1426-4697',
  {
    imports: [
      "import { NavBar, NavBarBackButton, NavBarContent, NavBarTitle, NavBarTrailing } from '@ledgerhq/lumen-ui-rnative'",
    ],
    props: {
      density: figma.enum('density', {
        compact: 'compact',
        expanded: 'expanded',
      }),
      backButton: figma.boolean('show-back', {
        true: <NavBarBackButton onPress={() => {}} />,
        false: undefined,
      }),
      title: figma.string('title'),
    },
    example: (props) => (
      <NavBar density={props.density}>
        {props.backButton}
        <NavBarContent>
          <NavBarTitle>{props.title}</NavBarTitle>
        </NavBarContent>
      </NavBar>
    ),
  },
);
