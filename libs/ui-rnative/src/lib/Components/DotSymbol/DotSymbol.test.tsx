import { describe, it, expect } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ArrowDown } from '../../Symbols';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { DotSymbol } from './DotSymbol';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
    {children}
  </ThemeProvider>
);

describe('DotSymbol Component', () => {
  const dotSrc = 'https://crypto-icons.ledger.com/BTC.png';

  it('should render children and dot image', () => {
    const { getByText, getByTestId } = render(
      <TestWrapper>
        <DotSymbol src={dotSrc} alt='Bitcoin'>
          <Text>Child</Text>
        </DotSymbol>
      </TestWrapper>,
    );

    expect(getByText('Child')).toBeTruthy();

    const img = getByTestId('dot-symbol-img');
    expect(img.props.source).toEqual({ uri: dotSrc });
  });

  it('should render without children', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <DotSymbol src={dotSrc} />
      </TestWrapper>,
    );

    expect(getByTestId('dot-symbol-img')).toBeTruthy();
  });

  it('should render fallback when image fails to load', async () => {
    const { getByTestId, queryByTestId, rerender } = render(
      <TestWrapper>
        <DotSymbol src='https://broken-link.com/404.png' />
      </TestWrapper>,
    );

    const img = getByTestId('dot-symbol-img');
    img.props.onError();

    rerender(
      <TestWrapper>
        <DotSymbol src='https://broken-link.com/404.png' />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(queryByTestId('dot-symbol-img')).toBeNull();
    });
  });

  it('should reset error state when src changes', async () => {
    const { getByTestId, rerender } = render(
      <TestWrapper>
        <DotSymbol src='https://broken-link.com/404.png' />
      </TestWrapper>,
    );

    const img = getByTestId('dot-symbol-img');
    img.props.onError();

    rerender(
      <TestWrapper>
        <DotSymbol src={dotSrc} />
      </TestWrapper>,
    );

    await waitFor(() => {
      const newImg = getByTestId('dot-symbol-img');
      expect(newImg.props.source).toEqual({ uri: dotSrc });
    });
  });

  it('should set accessibility label from alt prop', () => {
    const { getByLabelText } = render(
      <TestWrapper>
        <DotSymbol src={dotSrc} alt='Bitcoin network' />
      </TestWrapper>,
    );

    expect(getByLabelText('Bitcoin network')).toBeTruthy();
  });

  it('should apply custom styles', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <DotSymbol testID='ds' src={dotSrc} style={{ marginTop: 10 }} />
      </TestWrapper>,
    );

    const root = getByTestId('ds');
    expect(root.props.style.marginTop).toBe(10);
  });

  it('should pass additional props', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <DotSymbol testID='custom-dot' src={dotSrc} />
      </TestWrapper>,
    );

    expect(getByTestId('custom-dot')).toBeTruthy();
  });

  it('should have correct displayName', () => {
    expect(DotSymbol.displayName).toBe('DotSymbol');
  });

  describe('Icon variant', () => {
    it('should render an icon instead of an image', () => {
      const { queryByTestId } = render(
        <TestWrapper>
          <DotSymbol type='icon' appearance='success' icon={ArrowDown}>
            <Text>Child</Text>
          </DotSymbol>
        </TestWrapper>,
      );

      expect(queryByTestId('dot-symbol-img')).toBeNull();
    });

    it.each([
      { appearance: 'success' as const, tokenKey: 'successStrong' },
      { appearance: 'muted' as const, tokenKey: 'mutedStrong' },
      { appearance: 'error' as const, tokenKey: 'errorStrong' },
    ])(
      'should apply $tokenKey background for $appearance appearance',
      ({ appearance, tokenKey }) => {
        const { toJSON } = render(
          <TestWrapper>
            <DotSymbol
              testID='icon-dot'
              type='icon'
              appearance={appearance}
              icon={ArrowDown}
            />
          </TestWrapper>,
        );

        const colors = ledgerLiveThemes.dark.colors.bg;
        const expectedColor = colors[tokenKey as keyof typeof colors];

        const json = toJSON();
        const findDotWithBg = (node: any): boolean => {
          if (!node) return false;
          if (node.props?.style) {
            const style = Array.isArray(node.props.style)
              ? Object.assign({}, ...node.props.style.flat())
              : node.props.style;
            if (style.backgroundColor === expectedColor) return true;
          }
          if (node.children) {
            return node.children.some((child: any) => findDotWithBg(child));
          }
          return false;
        };

        expect(findDotWithBg(json)).toBe(true);
      },
    );

    it('should pass additional props in icon mode', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <DotSymbol
            testID='icon-dot'
            type='icon'
            appearance='success'
            icon={ArrowDown}
          />
        </TestWrapper>,
      );

      expect(getByTestId('icon-dot')).toBeTruthy();
    });
  });
});
