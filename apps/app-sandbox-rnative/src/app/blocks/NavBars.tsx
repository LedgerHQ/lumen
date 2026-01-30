import {
  Box,
  NavBar,
  NavBarBackButton,
  NavBarCoinCapsule,
  NavBarDescription,
  NavBarTitle,
} from '@ledgerhq/lumen-ui-rnative';
import { CryptoBitcoinCoin } from '@ledgerhq/lumen-ui-rnative/symbols';

export const NavBars = () => {
  return (
    <Box>
      <NavBar appearance='with-asset'>
        <NavBarTitle>Title</NavBarTitle>
        <NavBarDescription>Description</NavBarDescription>
        <NavBarCoinCapsule
          ticker='BTC'
          icon={<CryptoBitcoinCoin size={24} />}
        />
        <NavBarBackButton />
      </NavBar>
    </Box>
  );
};
