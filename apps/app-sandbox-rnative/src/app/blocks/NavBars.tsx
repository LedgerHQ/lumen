import Icon from '@ledgerhq/crypto-icons/native';
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
import {
  MoreVertical,
  Star,
  StarFill,
} from '@ledgerhq/lumen-ui-rnative/symbols';
import { useState } from 'react';

export const NavBars = () => {
  const [isFavorited, setIsFavorited] = useState(false);

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
          <NavBarTrailing>
            <IconButton
              icon={MoreVertical}
              appearance='no-background'
              size='md'
              accessibilityLabel='Settings'
            />
          </NavBarTrailing>
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
              Please carefully and thoroughly review, verify, and confirm all
              provided information, assumptions, inputs, and associated details
              in their entirety to ensure absolute accuracy and completeness
              before taking any further action or proceeding to the next step.
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
          <NavBarTrailing>
            <IconButton
              icon={isFavorited ? StarFill : Star}
              appearance='no-background'
              size='md'
              accessibilityLabel='Settings'
              onPress={() => setIsFavorited((s) => !s)}
            />
          </NavBarTrailing>
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
