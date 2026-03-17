import { describe, it, expect, jest } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { fireEvent, render } from '@testing-library/react-native';
import type { ReactNode } from 'react';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import {
  MediaCard,
  MediaCardDescription,
  MediaCardLeadingContent,
  MediaCardTitle,
  MediaCardTrailingContent,
} from './MediaCard';

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
  it('should render children', () => {
    const { getByText } = render(
      <TestWrapper>
        <MediaCard {...makeProps()}>
          <MediaCardTrailingContent>
            <MediaCardTitle>Title</MediaCardTitle>
          </MediaCardTrailingContent>
        </MediaCard>
      </TestWrapper>,
    );

    getByText('Title');
  });

  it('should render leading and trailing content', () => {
    const { getByText } = render(
      <TestWrapper>
        <MediaCard {...makeProps()}>
          <MediaCardLeadingContent testID='leading'>
            <MediaCardTitle>Tag</MediaCardTitle>
          </MediaCardLeadingContent>
          <MediaCardTrailingContent>
            <MediaCardTitle>Title</MediaCardTitle>
          </MediaCardTrailingContent>
        </MediaCard>
      </TestWrapper>,
    );

    getByText('Tag');
    getByText('Title');
  });

  it('should render title and description', () => {
    const { getByText } = render(
      <TestWrapper>
        <MediaCard {...makeProps()}>
          <MediaCardTrailingContent>
            <MediaCardTitle>Card Title</MediaCardTitle>
            <MediaCardDescription>Card description</MediaCardDescription>
          </MediaCardTrailingContent>
        </MediaCard>
      </TestWrapper>,
    );

    getByText('Card Title');
    getByText('Card description');
  });

  it('should fire onPress on press', () => {
    const props = makeProps();
    const { getByTestId } = render(
      <TestWrapper>
        <MediaCard {...props} testID='media-card'>
          <MediaCardTrailingContent>
            <MediaCardTitle>Title</MediaCardTitle>
          </MediaCardTrailingContent>
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
          <MediaCardTrailingContent>
            <MediaCardTitle>Title</MediaCardTitle>
          </MediaCardTrailingContent>
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
          <MediaCardTrailingContent>
            <MediaCardTitle>Title</MediaCardTitle>
          </MediaCardTrailingContent>
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
          <MediaCardTrailingContent>
            <MediaCardTitle>Title</MediaCardTitle>
          </MediaCardTrailingContent>
        </MediaCard>
      </TestWrapper>,
    );

    fireEvent.press(getByTestId('media-card-close-button'));
    expect(props.onClose).toHaveBeenCalledTimes(1);
  });
});
