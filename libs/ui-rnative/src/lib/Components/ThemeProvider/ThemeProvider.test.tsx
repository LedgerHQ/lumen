import { describe, expect, it } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render, screen } from '@testing-library/react-native';
import { ChevronBigLeft, Wallet } from '../../Symbols';
import { Button } from '../Button';
import { Spot } from '../Spot';
import { Tile } from '../Tile/Tile';
import { Box, Text } from '../Utility';
import { ThemeProvider } from './ThemeProvider';

describe('ThemeProvider', () => {
  it('renders children correctly', () => {
    render(
      <ThemeProvider themes={ledgerLiveThemes}>
        <Button testID='child'>Hello World</Button>
        <Tile>Tile</Tile>
        <Spot appearance='icon' icon={Wallet} />
        <Box>
          <Text>Text</Text>
        </Box>
        <ChevronBigLeft />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('child')).toBeTruthy();
    expect(screen.getByText('Hello World')).toBeTruthy();
  });
});
