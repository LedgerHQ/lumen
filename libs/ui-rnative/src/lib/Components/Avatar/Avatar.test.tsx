import { describe, it, expect } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render, waitFor } from '@testing-library/react-native';
import { DotIndicator, getDotIndicatorProps } from '../DotIndicator';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { Avatar } from './Avatar';

const { sizes, colors } = ledgerLiveThemes.dark;

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

  it('should render with md size by default', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <Avatar testID='avatar-id' />
      </TestWrapper>,
    );
    expect(getByTestId('avatar-id').props.style.width).toBe(sizes.s48);
    expect(getByTestId('avatar-id').props.style.height).toBe(sizes.s48);
  });

  it('should render with xs size when specified', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <Avatar testID='avatar-id' size='xs' />
      </TestWrapper>,
    );
    expect(getByTestId('avatar-id').props.style.width).toBe(sizes.s24);
    expect(getByTestId('avatar-id').props.style.height).toBe(sizes.s24);
  });

  it('should render with 2xl size when specified', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <Avatar testID='avatar-id' size='2xl' />
      </TestWrapper>,
    );
    expect(getByTestId('avatar-id').props.style.width).toBe(sizes.s128);
    expect(getByTestId('avatar-id').props.style.height).toBe(sizes.s128);
  });

  it('should render with different sizes', () => {
    const { getByTestId, rerender } = render(
      <TestWrapper>
        <Avatar testID='avatar-id' size='sm' />
      </TestWrapper>,
    );
    expect(getByTestId('avatar-id').props.style.width).toBe(sizes.s40);

    rerender(
      <TestWrapper>
        <Avatar testID='avatar-id' size='lg' />
      </TestWrapper>,
    );
    expect(getByTestId('avatar-id').props.style.width).toBe(sizes.s56);

    rerender(
      <TestWrapper>
        <Avatar testID='avatar-id' size='xl' />
      </TestWrapper>,
    );
    expect(getByTestId('avatar-id').props.style.width).toBe(sizes.s72);
  });

  it('should render fallback icon when no src is provided', () => {
    const { getByLabelText, getByTestId } = render(
      <TestWrapper>
        <Avatar />
      </TestWrapper>,
    );

    const avatarContainer = getByLabelText('avatar');
    expect(avatarContainer).toBeTruthy();
    expect(avatarContainer.props.accessibilityRole).toBe('image');
    expect(getByTestId('avatar-fallback-icon')).toBeTruthy();
  });

  it('should render fallback text instead of the icon when provided', () => {
    const { getByText, queryByTestId } = render(
      <TestWrapper>
        <Avatar fallbackText='AB' />
      </TestWrapper>,
    );

    expect(getByText('AB')).toBeTruthy();
    expect(queryByTestId('avatar-fallback-icon')).toBeNull();
  });

  it('should apply the fallback color as the background when falling back', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <Avatar testID='avatar-id' fallbackColor='#aed09c' />
      </TestWrapper>,
    );

    expect(getByTestId('avatar-id').props.style.backgroundColor).toBe(
      '#aed09c',
    );
  });

  it('should not apply the fallback color when an image is shown', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <Avatar testID='avatar-id' src={testSrc} fallbackColor='#aed09c' />
      </TestWrapper>,
    );

    expect(getByTestId('avatar-id').props.style.backgroundColor).toBe(
      colors.bg.baseTransparentHover,
    );
  });

  it('should render image when src is provided', () => {
    const { getByLabelText, getByTestId } = render(
      <TestWrapper>
        <Avatar src='https://example.com/avatar.jpg' alt='user avatar' />
      </TestWrapper>,
    );

    const avatarContainer = getByLabelText('user avatar');
    expect(avatarContainer).toBeTruthy();
    expect(avatarContainer.props.accessibilityRole).toBe('image');

    const image = getByTestId('avatar-image');
    expect(image.props.source).toEqual({
      uri: 'https://example.com/avatar.jpg',
    });
  });

  it('should render fallback icon on image error', async () => {
    const { getByLabelText, getByTestId, queryByTestId, rerender } = render(
      <TestWrapper>
        <Avatar src='https://example.com/invalid.jpg' alt='broken image' />
      </TestWrapper>,
    );

    const avatarContainer = getByLabelText('broken image');
    expect(avatarContainer).toBeTruthy();

    const image = getByTestId('avatar-image');
    expect(image).toBeTruthy();

    image.props.onError();

    rerender(
      <TestWrapper>
        <Avatar src='https://example.com/invalid.jpg' alt='broken image' />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(queryByTestId('avatar-image')).toBeNull();
      expect(getByTestId('avatar-fallback-icon')).toBeTruthy();
    });
  });

  it('should reset error state when src changes', async () => {
    const { getByLabelText, getByTestId, rerender } = render(
      <TestWrapper>
        <Avatar src='https://example.com/avatar1.jpg' alt='avatar image' />
      </TestWrapper>,
    );

    const avatarContainer = getByLabelText('avatar image');
    expect(avatarContainer).toBeTruthy();

    const image = getByTestId('avatar-image');
    image.props.onError();

    rerender(
      <TestWrapper>
        <Avatar src='https://example.com/avatar2.jpg' alt='avatar image' />
      </TestWrapper>,
    );

    await waitFor(() => {
      const newImage = getByTestId('avatar-image');
      expect(newImage.props.source).toEqual({
        uri: 'https://example.com/avatar2.jpg',
      });
    });
  });

  it('should render a notification indicator when wrapped in DotIndicator', () => {
    const { getByTestId, toJSON } = render(
      <TestWrapper>
        <DotIndicator {...getDotIndicatorProps('avatar', 'md')}>
          <Avatar testID='avatar-id' size='md' />
        </DotIndicator>
      </TestWrapper>,
    );

    const tree = toJSON();
    expect(tree.children).toHaveLength(2);
    expect(tree.children[0].props.accessibilityRole).toBe('image');
    expect(tree.children[0].props.pointerEvents).toBe('none');
    expect(getByTestId('avatar-id')).toBeTruthy();
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
