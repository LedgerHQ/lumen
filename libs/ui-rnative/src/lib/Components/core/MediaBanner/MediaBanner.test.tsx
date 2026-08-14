import { describe, it, expect, jest } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { fireEvent, render } from '@testing-library/react-native';
import { type ReactNode } from 'react';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import {
  MediaBanner,
  MediaBannerTitle,
  MediaBannerDescription,
} from './MediaBanner';

const TestWrapper = ({ children }: { children: ReactNode }) => (
  <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
    {children}
  </ThemeProvider>
);

const IMAGE_URL = 'https://example.com/image.jpg';

describe('MediaBanner', () => {
  it('should render title and description', () => {
    const { getByText } = render(
      <TestWrapper>
        <MediaBanner imageUrl={IMAGE_URL}>
          <MediaBannerTitle>Banner Title</MediaBannerTitle>
          <MediaBannerDescription>Banner description</MediaBannerDescription>
        </MediaBanner>
      </TestWrapper>,
    );

    getByText('Banner Title');
    getByText('Banner description');
  });

  it('should call onClose when close button is pressed', () => {
    const handleClose = jest.fn();
    const { getByTestId } = render(
      <TestWrapper>
        <MediaBanner imageUrl={IMAGE_URL} onClose={handleClose}>
          <MediaBannerTitle>Title</MediaBannerTitle>
        </MediaBanner>
      </TestWrapper>,
    );

    const closeButton = getByTestId('media-banner-close-button');
    expect(closeButton).toBeTruthy();
    fireEvent.press(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should call onPress when pressed', () => {
    const handlePress = jest.fn();
    const { getByTestId } = render(
      <TestWrapper>
        <MediaBanner
          testID='media-banner'
          imageUrl={IMAGE_URL}
          onPress={handlePress}
        >
          <MediaBannerTitle>Title</MediaBannerTitle>
        </MediaBanner>
      </TestWrapper>,
    );

    fireEvent.press(getByTestId('media-banner'));
    expect(handlePress).toHaveBeenCalledTimes(1);
  });

  it('should apply surface background color', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <MediaBanner testID='media-banner' imageUrl={IMAGE_URL}>
          <MediaBannerTitle>Title</MediaBannerTitle>
        </MediaBanner>
      </TestWrapper>,
    );

    const banner = getByTestId('media-banner');
    expect(banner.props.style.backgroundColor).toBe(
      ledgerLiveThemes.dark.colors.bg.surface,
    );
  });

  it('should keep a fixed height regardless of description line count', () => {
    const { getByTestId, rerender } = render(
      <TestWrapper>
        <MediaBanner testID='media-banner' imageUrl={IMAGE_URL}>
          <MediaBannerTitle>Title</MediaBannerTitle>
          <MediaBannerDescription>One line</MediaBannerDescription>
        </MediaBanner>
      </TestWrapper>,
    );

    expect(getByTestId('media-banner').props.style.height).toBe(
      ledgerLiveThemes.dark.sizes.s72,
    );

    rerender(
      <TestWrapper>
        <MediaBanner testID='media-banner' imageUrl={IMAGE_URL}>
          <MediaBannerTitle>Title</MediaBannerTitle>
          <MediaBannerDescription>
            The image failed to load so the banner decided to gracefully hide
            it.
          </MediaBannerDescription>
        </MediaBanner>
      </TestWrapper>,
    );

    expect(getByTestId('media-banner').props.style.height).toBe(
      ledgerLiveThemes.dark.sizes.s72,
    );
  });

  it('should render with imageUrl prop', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <MediaBanner testID='media-banner' imageUrl={IMAGE_URL}>
          <MediaBannerTitle>Title</MediaBannerTitle>
        </MediaBanner>
      </TestWrapper>,
    );

    expect(getByTestId('media-banner')).toBeTruthy();
  });
});
