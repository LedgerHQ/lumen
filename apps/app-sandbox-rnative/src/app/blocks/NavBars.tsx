import Icon from '@ledgerhq/crypto-icons/native';
import {
  Box,
  NavBar,
  NavBarBackButton,
  NavBarCoinCapsule,
  NavBarContent,
  NavBarDescription,
  NavBarTitle,
} from '@ledgerhq/lumen-ui-rnative';

export const NavBars = () => {
  return (
    <Box lx={{ gap: 's16', marginVertical: 's4' }}>
      <Box
        lx={{
          backgroundColor: 'surfaceTransparent',
          borderRadius: 'lg',
        }}
      >
        <NavBar appearance='compact'>
          <NavBarBackButton />
          <NavBarContent>
            <NavBarTitle>Portfolio</NavBarTitle>
            <NavBarDescription>Manage your positions</NavBarDescription>
          </NavBarContent>
        </NavBar>
      </Box>
      <Box
        lx={{
          backgroundColor: 'surfaceTransparent',
          borderRadius: 'lg',
        }}
      >
        <NavBar appearance='expanded'>
          <NavBarBackButton />
          <NavBarContent>
            <NavBarTitle>Are you sure you want to continue?</NavBarTitle>
            <NavBarDescription>
              This transfer can't be undone once confirmed.
            </NavBarDescription>
            <NavBarDescription>
              Please double-check the details before proceeding.
            </NavBarDescription>
          </NavBarContent>
        </NavBar>
      </Box>

      <Box
        lx={{
          backgroundColor: 'surfaceTransparent',
          borderRadius: 'lg',
        }}
      >
        <NavBar appearance='compact'>
          <NavBarBackButton />
          <NavBarContent>
            <NavBarCoinCapsule
              ticker='BTC'
              icon={<Icon ledgerId='bitcoin' ticker='BTC' size={24} />}
            />
          </NavBarContent>
        </NavBar>
      </Box>
    </Box>
  );
};
