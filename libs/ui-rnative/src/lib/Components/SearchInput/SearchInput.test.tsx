import { describe, it, expect } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render, screen } from '@testing-library/react-native';

import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { SearchInput } from './SearchInput';

const { colors } = ledgerLiveThemes.dark;

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
      {component}
    </ThemeProvider>,
  );
};

const getSearchIcon = () => screen.UNSAFE_getByProps({ fill: 'none' });

describe('SearchInput', () => {
  describe('Icon color', () => {
    it('should render the search icon with muted color by default', () => {
      renderWithProvider(<SearchInput />);

      const icon = getSearchIcon();
      expect(icon.props.color).toBe(colors.text.muted);
    });

    it('should render the search icon with disabled color when disabled', () => {
      renderWithProvider(<SearchInput disabled />);

      const icon = getSearchIcon();
      expect(icon.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ color: colors.text.disabled }),
        ]),
      );
    });
  });
});
