import { describe, it, expect } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render, waitFor } from '@testing-library/react-native';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { MediaImage } from './MediaImage';

const { sizes, borderRadius } = ledgerLiveThemes.dark;

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
    {children}
  </ThemeProvider>
);

describe('MediaImage Component', () => {
  const validSrc = 'https://crypto-icons.ledger.com/ADA.png';

  it('should render with image when valid src is provided', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <MediaImage src={validSrc} alt='Cardano' />
      </TestWrapper>,
    );

    const img = getByTestId('media-image-img');
    expect(img.props.source).toEqual({ uri: validSrc });
  });

  it('should render fallback when no src is provided', () => {
    const { queryByTestId } = render(
      <TestWrapper>
        <MediaImage alt='Empty' />
      </TestWrapper>,
    );

    expect(queryByTestId('media-image-img')).toBeNull();
  });

  it('should render fallback when src is empty string', () => {
    const { queryByTestId } = render(
      <TestWrapper>
        <MediaImage src='' alt='Empty' />
      </TestWrapper>,
    );

    expect(queryByTestId('media-image-img')).toBeNull();
  });

  it('should render fallback when image fails to load', async () => {
    const { getByTestId, queryByTestId, rerender } = render(
      <TestWrapper>
        <MediaImage src='https://broken-link.com/404.png' alt='Broken' />
      </TestWrapper>,
    );

    const img = getByTestId('media-image-img');
    img.props.onError();

    rerender(
      <TestWrapper>
        <MediaImage src='https://broken-link.com/404.png' alt='Broken' />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(queryByTestId('media-image-img')).toBeNull();
    });
  });

  it('should reset error state when src changes', async () => {
    const { getByTestId, rerender } = render(
      <TestWrapper>
        <MediaImage src='https://broken-link.com/404.png' alt='Test' />
      </TestWrapper>,
    );

    const img = getByTestId('media-image-img');
    img.props.onError();

    rerender(
      <TestWrapper>
        <MediaImage src={validSrc} alt='Test' />
      </TestWrapper>,
    );

    await waitFor(() => {
      const newImg = getByTestId('media-image-img');
      expect(newImg.props.source).toEqual({ uri: validSrc });
    });
  });

  it('should apply default size (48)', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <MediaImage testID='mi' src={validSrc} alt='Test' />
      </TestWrapper>,
    );

    const root = getByTestId('mi');
    expect(root.props.style.width).toBe(sizes.s48);
    expect(root.props.style.height).toBe(sizes.s48);
  });

  it('should apply specified size', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <MediaImage testID='mi' src={validSrc} alt='Test' size={24} />
      </TestWrapper>,
    );

    const root = getByTestId('mi');
    expect(root.props.style.width).toBe(sizes.s24);
    expect(root.props.style.height).toBe(sizes.s24);
  });

  it('should apply circle shape', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <MediaImage testID='mi' src={validSrc} alt='Test' shape='circle' />
      </TestWrapper>,
    );

    const root = getByTestId('mi');
    expect(root.props.style.borderRadius).toBe(borderRadius.full);
  });

  it('should apply square shape with correct border radius', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <MediaImage testID='mi' src={validSrc} alt='Test' size={48} shape='square' />
      </TestWrapper>,
    );

    const root = getByTestId('mi');
    expect(root.props.style.borderRadius).toBe(borderRadius.md);
  });

  it('should set accessibility label from alt prop', () => {
    const { getByLabelText } = render(
      <TestWrapper>
        <MediaImage src={validSrc} alt='Cardano icon' />
      </TestWrapper>,
    );

    expect(getByLabelText('Cardano icon')).toBeTruthy();
  });

  it('should apply custom styles', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <MediaImage testID='mi' src={validSrc} alt='Test' style={{ borderWidth: 2 }} />
      </TestWrapper>,
    );

    const root = getByTestId('mi');
    expect(root.props.style.borderWidth).toBe(2);
  });

  it('should pass additional props', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <MediaImage testID='custom-id' src={validSrc} alt='Test' />
      </TestWrapper>,
    );

    expect(getByTestId('custom-id')).toBeTruthy();
  });
});
