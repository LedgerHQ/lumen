import {
  Box,
  NavBar,
  NavBarBackButton,
  NavBarDescription,
  NavBarTitle,
} from '@ledgerhq/lumen-ui-rnative';

export const NavBars = () => {
  return (
    <Box>
      <NavBar appearance='compact'>
        <NavBarTitle>Title</NavBarTitle>
        <NavBarDescription>Description</NavBarDescription>
        <NavBarBackButton />
      </NavBar>
    </Box>
  );
};
