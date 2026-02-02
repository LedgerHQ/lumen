import Icon from '@ledgerhq/crypto-icons/native';
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
    <Box lx={{ gap: 's16', marginVertical: 's4' }}>
      <Box
        lx={{
          backgroundColor: 'surfaceTransparent',
          borderRadius: 'lg',
        }}
      >
        <NavBar appearance='compact'>
          <NavBarTitle>Title</NavBarTitle>
          <NavBarDescription>Description</NavBarDescription>
          <NavBarCoinCapsule
            ticker='BTC'
            icon={<Icon ledgerId='bitcoin' ticker='BTC' size={24} />}
          />
          <NavBarBackButton />
        </NavBar>
      </Box>
      <Box
        lx={{
          backgroundColor: 'surfaceTransparent',
          borderRadius: 'lg',
        }}
      >
        <NavBar appearance='expanded'>
          <NavBarTitle>Title</NavBarTitle>
          <NavBarDescription>Description</NavBarDescription>
          <NavBarCoinCapsule
            ticker='BTC'
            icon={<Icon ledgerId='bitcoin' ticker='BTC' size={24} />}
          />
          <NavBarBackButton />
        </NavBar>
      </Box>

      <Box
        lx={{
          backgroundColor: 'surfaceTransparent',
          borderRadius: 'lg',
        }}
      >
        <NavBar appearance='with-asset'>
          <NavBarTitle>Title</NavBarTitle>
          <NavBarDescription>Description</NavBarDescription>
          <NavBarCoinCapsule
            ticker='BTC'
            icon={<Icon ledgerId='bitcoin' ticker='BTC' size={24} />}
          />
          <NavBarBackButton />
        </NavBar>
      </Box>
    </Box>
  );
};
