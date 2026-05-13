import { describe, it, expect } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { MediaTag } from './MediaTag';

const renderWithProvider = (component: React.ReactElement) =>
  render(
    <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
      {component}
    </ThemeProvider>,
  );

describe('MediaTag Component', () => {
  it('should render label and the provided ReactNode icon as-is', () => {
    renderWithProvider(
      <MediaTag
        label='Bitcoin'
        leadingContent={<Text testID='media-icon'>bitcoin-icon</Text>}
      />,
    );
    expect(screen.getByText('Bitcoin')).toBeTruthy();
    expect(screen.getByTestId('media-icon')).toBeTruthy();
    expect(screen.getByText('bitcoin-icon')).toBeTruthy();
  });
});
