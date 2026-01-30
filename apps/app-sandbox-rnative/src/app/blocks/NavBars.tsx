import { CryptoIcon } from '@ledgerhq/crypto-icons';
import {
  Box,
  NavBar,
  NavBarBackButton,
  NavBarCoinCapsule,
  NavBarDescription,
  NavBarTitle,
} from '@ledgerhq/lumen-ui-rnative';

export const NavBars = () => {
  return (
    <Box>
      <NavBar appearance='with-asset'>
        <NavBarTitle>Title</NavBarTitle>
        <NavBarDescription>Description</NavBarDescription>
        {/* <NavBarCoinCapsule
          ticker='BTC'
          icon={<CryptoIcon ledgerId='bitcoin' ticker='BTC' size='24px' />}
        /> */}
        <NavBarBackButton />
      </NavBar>
    </Box>
  );
};
