import { describe, it, expect } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import {
  SectionHeader,
  SectionHeaderLeading,
  SectionHeaderTitle,
} from './SectionHeader';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
    {children}
  </ThemeProvider>
);

describe('SectionHeader', () => {
  it('renders the title', () => {
    render(
      <TestWrapper>
        <SectionHeader>
          <SectionHeaderTitle>Label</SectionHeaderTitle>
        </SectionHeader>
      </TestWrapper>,
    );
    expect(screen.getByText('Label')).toBeTruthy();
  });

  it('renders with card appearance', () => {
    render(
      <TestWrapper>
        <SectionHeader appearance='card' testID='section-header'>
          <SectionHeaderTitle>Label</SectionHeaderTitle>
        </SectionHeader>
      </TestWrapper>,
    );
    expect(screen.getByText('Label')).toBeTruthy();
    expect(screen.getByTestId('section-header')).toBeTruthy();
  });

  it('renders with no-background appearance by default', () => {
    render(
      <TestWrapper>
        <SectionHeader testID='section-header'>
          <SectionHeaderTitle>Label</SectionHeaderTitle>
        </SectionHeader>
      </TestWrapper>,
    );
    expect(screen.getByTestId('section-header')).toBeTruthy();
  });

  it('renders leading content when provided', () => {
    render(
      <TestWrapper>
        <SectionHeader>
          <SectionHeaderLeading testID='leading'>
            <Text>icon</Text>
          </SectionHeaderLeading>
          <SectionHeaderTitle>Label</SectionHeaderTitle>
        </SectionHeader>
      </TestWrapper>,
    );
    expect(screen.getByTestId('leading')).toBeTruthy();
    expect(screen.getByText('Label')).toBeTruthy();
  });

  it('renders all subcomponents together with card appearance', () => {
    render(
      <TestWrapper>
        <SectionHeader appearance='card' testID='section-header'>
          <SectionHeaderLeading testID='leading'>
            <Text>icon</Text>
          </SectionHeaderLeading>
          <SectionHeaderTitle>Accounts</SectionHeaderTitle>
        </SectionHeader>
      </TestWrapper>,
    );
    expect(screen.getByTestId('leading')).toBeTruthy();
    expect(screen.getByText('Accounts')).toBeTruthy();
    expect(screen.getByTestId('section-header')).toBeTruthy();
  });

  it('keeps leading content visible with a long title', () => {
    render(
      <TestWrapper>
        <SectionHeader lx={{ maxWidth: 's80' }}>
          <SectionHeaderLeading testID='leading'>
            <Text>icon</Text>
          </SectionHeaderLeading>
          <SectionHeaderTitle>
            Very long section header label that should truncate
          </SectionHeaderTitle>
        </SectionHeader>
      </TestWrapper>,
    );

    expect(screen.getByTestId('leading')).toBeTruthy();
    expect(
      screen.getByText('Very long section header label that should truncate'),
    ).toBeTruthy();
  });
});
