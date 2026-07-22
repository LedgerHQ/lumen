import { describe, it, expect, jest } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render, fireEvent } from '@testing-library/react-native';
import { type ReactNode, createRef } from 'react';
import type { View } from 'react-native';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { AvatarButton } from './AvatarButton';

const TestWrapper = ({ children }: { children: ReactNode }) => (
  <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
    {children}
  </ThemeProvider>
);

describe('AvatarButton Component', () => {
  const validSrc = 'https://example.com/photo.jpg';

  it('should render a pressable wrapping the avatar', () => {
    const { getByRole, getByLabelText } = render(
      <TestWrapper>
        <AvatarButton src={validSrc} alt='Open menu' />
      </TestWrapper>,
    );

    expect(getByRole('button')).toBeTruthy();
    expect(getByLabelText('Open menu')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      <TestWrapper>
        <AvatarButton src={validSrc} onPress={onPress} />
      </TestWrapper>,
    );

    fireEvent.press(getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should forward alt to the underlying Avatar', () => {
    const { getByLabelText } = render(
      <TestWrapper>
        <AvatarButton src={validSrc} alt='User profile' />
      </TestWrapper>,
    );

    expect(getByLabelText('User profile')).toBeTruthy();
  });

  it('should render fallback icon when no src is provided', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <AvatarButton />
      </TestWrapper>,
    );

    expect(getByTestId('avatar-fallback-icon')).toBeTruthy();
  });

  it('should render image when src is provided', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <AvatarButton src={validSrc} />
      </TestWrapper>,
    );

    const image = getByTestId('avatar-image');
    expect(image.props.source).toEqual({ uri: validSrc });
  });

  it('should forward testID to the pressable', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <AvatarButton src={validSrc} testID='avatar-btn' />
      </TestWrapper>,
    );

    expect(getByTestId('avatar-btn')).toBeTruthy();
  });

  it('should forward ref to the pressable element', () => {
    const ref = createRef<View>();
    render(
      <TestWrapper>
        <AvatarButton src={validSrc} ref={ref} />
      </TestWrapper>,
    );

    expect(ref.current).toBeTruthy();
  });
});
