import { describe, it, expect } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { MediaTag } from './MediaTag';

const { colors } = ledgerLiveThemes.dark;

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
    {children}
  </ThemeProvider>
);

const Icon = () => <Text testID='media-icon'>icon</Text>;

describe('MediaTag Component', () => {
  it('should render label and icon', () => {
    const { getByText, getByTestId } = render(
      <TestWrapper>
        <MediaTag label='Bitcoin' icon={<Icon />} />
      </TestWrapper>,
    );
    expect(getByText('Bitcoin')).toBeTruthy();
    expect(getByTestId('media-icon')).toBeTruthy();
  });

  it('should render with different appearances', () => {
    const { getByTestId, rerender } = render(
      <TestWrapper>
        <MediaTag
          testID='media-tag'
          appearance='accent'
          label='Accent'
          icon={<Icon />}
        />
      </TestWrapper>,
    );
    expect(getByTestId('media-tag').props.style.backgroundColor).toBe(
      colors.bg.accent,
    );

    rerender(
      <TestWrapper>
        <MediaTag
          testID='media-tag'
          appearance='success'
          label='Success'
          icon={<Icon />}
        />
      </TestWrapper>,
    );
    expect(getByTestId('media-tag').props.style.backgroundColor).toBe(
      colors.bg.success,
    );

    rerender(
      <TestWrapper>
        <MediaTag
          testID='media-tag'
          appearance='error'
          label='Error'
          icon={<Icon />}
        />
      </TestWrapper>,
    );
    expect(getByTestId('media-tag').props.style.backgroundColor).toBe(
      colors.bg.error,
    );
  });

  it('should render in disabled state with disabled background', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <MediaTag
          testID='media-tag'
          label='Disabled'
          icon={<Icon />}
          disabled
        />
      </TestWrapper>,
    );
    expect(getByTestId('media-tag').props.style.backgroundColor).toBe(
      colors.bg.disabled,
    );
  });

  it('should render with sm size', () => {
    const { getByText } = render(
      <TestWrapper>
        <MediaTag label='Small' size='sm' icon={<Icon />} />
      </TestWrapper>,
    );
    expect(getByText('Small')).toBeTruthy();
  });

  it('should render with md size', () => {
    const { getByText } = render(
      <TestWrapper>
        <MediaTag label='Medium' size='md' icon={<Icon />} />
      </TestWrapper>,
    );
    expect(getByText('Medium')).toBeTruthy();
  });

  it('should pass testID to root element', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <MediaTag testID='media-tag-id' label='Label' icon={<Icon />} />
      </TestWrapper>,
    );
    expect(getByTestId('media-tag-id')).toBeTruthy();
  });
});
