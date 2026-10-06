import { describe, expect, it } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render } from '@testing-library/react-native';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { SpotNumber } from './SpotNumber';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
    {children}
  </ThemeProvider>
);

describe('SpotNumber', () => {
  it('should render the digit', () => {
    const { getByText } = render(
      <TestWrapper>
        <SpotNumber value={5} />
      </TestWrapper>,
    );

    expect(getByText('5')).toBeTruthy();
  });
});
