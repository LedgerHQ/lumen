import { describe, it, expect, jest } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { fireEvent, render } from '@testing-library/react-native';
import type { ReactNode } from 'react';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { MediaCard, MediaCardTitle } from './MediaCard';

const TestWrapper = ({ children }: { children: ReactNode }) => (
  <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
    {children}
  </ThemeProvider>
);

const makeProps = () => ({
  imageUrl: 'https://example.com/image.jpg',
  onPress: jest.fn(),
  onClose: jest.fn(),
});

describe('MediaCard', () => {
  it('should render title', () => {
    const { getByText } = render(
      <TestWrapper>
        <MediaCard {...makeProps()}>
          <MediaCardTitle>Title</MediaCardTitle>
        </MediaCard>
      </TestWrapper>,
    );

    getByText('Title');
  });

  it('should render leading content and title', () => {
    const { getByText } = render(
      <TestWrapper>
        <MediaCard {...makeProps()}>
          <MediaCardTitle>Tag</MediaCardTitle>
          <MediaCardTitle>Title</MediaCardTitle>
        </MediaCard>
      </TestWrapper>,
    );

    getByText('Tag');
    getByText('Title');
  });

  it('should fire onPress on press', () => {
    const props = makeProps();
    const { getByTestId } = render(
      <TestWrapper>
        <MediaCard {...props} testID='media-card'>
          <MediaCardTitle>Title</MediaCardTitle>
        </MediaCard>
      </TestWrapper>,
    );

    fireEvent.press(getByTestId('media-card'));
    expect(props.onPress).toHaveBeenCalledTimes(1);
  });

  it('should show image after successful load', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <MediaCard {...makeProps()}>
          <MediaCardTitle>Title</MediaCardTitle>
        </MediaCard>
      </TestWrapper>,
    );

    const img = getByTestId('media-card-image');
    expect(img.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ opacity: 0 })]),
    );

    fireEvent(img, 'onLoad');
    expect(img.props.style).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ opacity: 0 })]),
    );
  });

  it('should hide image on error', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <MediaCard {...makeProps()}>
          <MediaCardTitle>Title</MediaCardTitle>
        </MediaCard>
      </TestWrapper>,
    );

    const img = getByTestId('media-card-image');
    fireEvent(img, 'onLoad');
    fireEvent(img, 'onError');

    expect(img.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ opacity: 0 })]),
    );
  });

  it('should fire onClose on close button press', () => {
    const props = makeProps();
    const { getByTestId } = render(
      <TestWrapper>
        <MediaCard {...props}>
          <MediaCardTitle>Title</MediaCardTitle>
        </MediaCard>
      </TestWrapper>,
    );

    fireEvent.press(getByTestId('media-card-close-button'));
    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  it('should not render close button when onClose is not provided', () => {
    const { queryByTestId } = render(
      <TestWrapper>
        <MediaCard imageUrl='https://example.com/image.jpg'>
          <MediaCardTitle>Title</MediaCardTitle>
        </MediaCard>
      </TestWrapper>,
    );

    expect(queryByTestId('media-card-close-button')).toBeNull();
  });

  it('should not have button role when onPress is not provided', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <MediaCard imageUrl='https://example.com/image.jpg' testID='media-card'>
          <MediaCardTitle>Title</MediaCardTitle>
        </MediaCard>
      </TestWrapper>,
    );

    expect(getByTestId('media-card').props.accessibilityRole).toBeUndefined();
  });
});
