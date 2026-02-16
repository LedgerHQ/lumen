import { describe, it, expect, jest } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Settings } from '../../Symbols';
import { Spot } from '../Spot';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import {
  ContentBanner,
  ContentBannerContent,
  ContentBannerTitle,
  ContentBannerDescription,
} from './ContentBanner';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
    {children}
  </ThemeProvider>
);

describe('ContentBanner', () => {
  it('should render children', () => {
    const { getByText } = render(
      <TestWrapper>
        <ContentBanner>
          <ContentBannerContent>
            <ContentBannerTitle>Title</ContentBannerTitle>
          </ContentBannerContent>
        </ContentBanner>
      </TestWrapper>,
    );

    getByText('Title');
  });

  it('should render title and description', () => {
    const { getByText } = render(
      <TestWrapper>
        <ContentBanner>
          <ContentBannerContent>
            <ContentBannerTitle>Banner Title</ContentBannerTitle>
            <ContentBannerDescription>
              Banner description
            </ContentBannerDescription>
          </ContentBannerContent>
        </ContentBanner>
      </TestWrapper>,
    );

    getByText('Banner Title');
    getByText('Banner description');
  });

  it('should render close button when onClose is provided', () => {
    const handleClose = jest.fn();
    const { getByTestId } = render(
      <TestWrapper>
        <ContentBanner onClose={handleClose}>
          <ContentBannerContent>
            <ContentBannerTitle>Title</ContentBannerTitle>
          </ContentBannerContent>
        </ContentBanner>
      </TestWrapper>,
    );

    const closeButton = getByTestId('content-banner-close-button');
    expect(closeButton).toBeTruthy();
    fireEvent.press(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should not render close button when onClose is not provided', () => {
    const { queryByTestId } = render(
      <TestWrapper>
        <ContentBanner>
          <ContentBannerContent>
            <ContentBannerTitle>Title</ContentBannerTitle>
          </ContentBannerContent>
        </ContentBanner>
      </TestWrapper>,
    );

    expect(queryByTestId('content-banner-close-button')).toBeNull();
  });

  it('should apply custom closeAriaLabel', () => {
    const handleClose = jest.fn();
    const { getByLabelText } = render(
      <TestWrapper>
        <ContentBanner onClose={handleClose} closeAriaLabel='Dismiss'>
          <ContentBannerContent>
            <ContentBannerTitle>Title</ContentBannerTitle>
          </ContentBannerContent>
        </ContentBanner>
      </TestWrapper>,
    );

    expect(getByLabelText('Dismiss')).toBeTruthy();
  });

  it('should render with a leading element', () => {
    const { getByText, getByTestId } = render(
      <TestWrapper>
        <ContentBanner testID='content-banner'>
          <Spot appearance='icon' icon={Settings} />
          <ContentBannerContent>
            <ContentBannerTitle>With Spot</ContentBannerTitle>
          </ContentBannerContent>
        </ContentBanner>
      </TestWrapper>,
    );

    expect(getByTestId('content-banner')).toBeTruthy();
    getByText('With Spot');
  });

  it('should apply surface background color', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <ContentBanner testID='content-banner'>
          <ContentBannerContent>
            <ContentBannerTitle>Title</ContentBannerTitle>
          </ContentBannerContent>
        </ContentBanner>
      </TestWrapper>,
    );

    const banner = getByTestId('content-banner');
    expect(banner.props.style.backgroundColor).toBe(
      ledgerLiveThemes.dark.colors.bg.surface,
    );
  });
});
