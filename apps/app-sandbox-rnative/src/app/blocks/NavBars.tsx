import Icon from '@ledgerhq/crypto-icons/native';
import { MoreHorizontal, Settings } from '@ledgerhq/lumen-symbols-rnative';
import {
  Box,
  IconButton,
  NavBar,
  NavBarBackButton,
  NavBarCoinCapsule,
  NavBarContent,
  NavBarDescription,
  NavBarTitle,
  NavBarTrailing,
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
            <NavBarTitle>
              Are you sure you want to continue? This transfer can't be undone
              once confirmed.
            </NavBarTitle>
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

      <Box
        lx={{
          backgroundColor: 'surfaceTransparent',
          borderRadius: 'lg',
        }}
      >
        <NavBar appearance='compact'>
          <NavBarBackButton />
          <NavBarContent>
            <NavBarTitle>With Trailing</NavBarTitle>
            <NavBarDescription>Shows trailing actions</NavBarDescription>
          </NavBarContent>
          <NavBarTrailing>
            <IconButton
              icon={Settings}
              appearance='no-background'
              size='md'
              accessibilityLabel='Settings'
            />
          </NavBarTrailing>
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
            <NavBarTitle>Multiple Actions</NavBarTitle>
          </NavBarContent>
          <NavBarTrailing>
            <IconButton
              icon={Settings}
              appearance='no-background'
              size='md'
              accessibilityLabel='Settings'
            />
            <IconButton
              icon={MoreHorizontal}
              appearance='no-background'
              size='md'
              accessibilityLabel='More'
            />
          </NavBarTrailing>
        </NavBar>
      </Box>
    </Box>
  );
};
