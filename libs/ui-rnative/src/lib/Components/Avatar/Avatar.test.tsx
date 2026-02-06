import { describe, it, expect } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { Avatar } from './Avatar';

const { colors, sizes } = ledgerLiveThemes.dark;

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
    {children}
  </ThemeProvider>
);

describe('Avatar Component', () => {
  const testSrc =
    'https://plus.unsplash.com/premium_photo-1689551670902-19b441a6afde?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
  it('should render correctly with minimal props', () => {
    const { getByLabelText } = render(
      <TestWrapper>
        <Avatar src={testSrc} />
      </TestWrapper>,
    );
    getByLabelText('avatar');
  });

  it('should render with custom alt text', () => {
    const { getByLabelText } = render(
      <TestWrapper>
        <Avatar src={testSrc} alt='user profile' />
      </TestWrapper>,
    );
    getByLabelText('user profile');
  });

  it('should render with different sizes', () => {
    const { getByTestId, rerender } = render(
      <TestWrapper>
        <Avatar testID='avatar-id' size='sm' />
      </TestWrapper>,
    );
    expect(getByTestId('avatar-id').props.style.width).toBe(sizes.s40);
    expect(getByTestId('avatar-id').props.style.height).toBe(sizes.s40);

    rerender(
      <TestWrapper>
        <Avatar testID='avatar-id' size='md' />
      </TestWrapper>,
    );
    expect(getByTestId('avatar-id').props.style.width).toBe(sizes.s48);
    expect(getByTestId('avatar-id').props.style.height).toBe(sizes.s48);
  });

  it('should render fallback icon when no src is provided', () => {
    const { queryByLabelText } = render(
      <TestWrapper>
        <Avatar />
      </TestWrapper>,
    );
    expect(queryByLabelText('avatar')).toBeNull();
  });

  it('should render image when src is provided', () => {
    const { getByLabelText } = render(
      <TestWrapper>
        <Avatar src='https://example.com/avatar.jpg' alt='user avatar' />
      </TestWrapper>,
    );
    const image = getByLabelText('user avatar');
    expect(image.props.source).toEqual({
      uri: 'https://example.com/avatar.jpg',
    });
  });

  it('should render fallback icon on image error', async () => {
    const { getByLabelText, queryByLabelText, rerender } = render(
      <TestWrapper>
        <Avatar src='https://example.com/invalid.jpg' alt='broken image' />
      </TestWrapper>,
    );

    const image = getByLabelText('broken image');

    image.props.onError();

    rerender(
      <TestWrapper>
        <Avatar src='https://example.com/invalid.jpg' alt='broken image' />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(queryByLabelText('broken image')).toBeNull();
    });
  });

  it('should reset error state when src changes', async () => {
    const { getByLabelText, rerender } = render(
      <TestWrapper>
        <Avatar src='https://example.com/avatar1.jpg' alt='avatar image' />
      </TestWrapper>,
    );

    const image = getByLabelText('avatar image');
    image.props.onError();

    rerender(
      <TestWrapper>
        <Avatar src='https://example.com/avatar2.jpg' alt='avatar image' />
      </TestWrapper>,
    );

    await waitFor(() => {
      const newImage = getByLabelText('avatar image');
      expect(newImage.props.source).toEqual({
        uri: 'https://example.com/avatar2.jpg',
      });
    });
  });

  it('should show notification indicator when showNotification is true', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <Avatar testID='avatar-id' showNotification />
      </TestWrapper>,
    );

    const avatar = getByTestId('avatar-id');
    const notificationIndicator = avatar.props.children[0];

    expect(notificationIndicator).toBeTruthy();
    expect(notificationIndicator.props.style.backgroundColor).toBe(
      colors.bg.errorStrong,
    );
  });

  it('should not show notification indicator by default', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <Avatar testID='avatar-id' />
      </TestWrapper>,
    );

    const avatar = getByTestId('avatar-id');
    const notificationIndicator = avatar.props.children[0];

    expect(notificationIndicator).toBe(false);
  });

  it('should apply correct notification indicator size based on avatar size', () => {
    const { getByTestId, rerender } = render(
      <TestWrapper>
        <Avatar testID='avatar-id' size='sm' showNotification />
      </TestWrapper>,
    );

    let avatar = getByTestId('avatar-id');
    let notificationIndicator = avatar.props.children[0];
    expect(notificationIndicator.props.style.width).toBe(sizes.s10);
    expect(notificationIndicator.props.style.height).toBe(sizes.s10);

    rerender(
      <TestWrapper>
        <Avatar testID='avatar-id' size='md' showNotification />
      </TestWrapper>,
    );

    avatar = getByTestId('avatar-id');
    notificationIndicator = avatar.props.children[0];
    expect(notificationIndicator.props.style.width).toBe(sizes.s12);
    expect(notificationIndicator.props.style.height).toBe(sizes.s12);
  });

  it('should apply custom styles', () => {
    const customStyle = { borderWidth: 2 };
    const { getByTestId } = render(
      <TestWrapper>
        <Avatar testID='avatar-id' style={customStyle} />
      </TestWrapper>,
    );

    const avatar = getByTestId('avatar-id');
    expect(avatar.props.style.borderWidth).toBe(2);
  });

  it('should pass additional props to the Box component', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <Avatar testID='custom-test-id' accessibilityLabel='Profile Avatar' />
      </TestWrapper>,
    );

    const avatar = getByTestId('custom-test-id');
    expect(avatar.props.accessibilityLabel).toBe('Profile Avatar');
  });
});
