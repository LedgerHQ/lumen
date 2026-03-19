import { describe, it, expect, jest } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import {
  MediaBanner,
  MediaBannerTitle,
  MediaBannerDescription,
} from './MediaBanner';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
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
