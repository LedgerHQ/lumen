import { describe, it, expect } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render, screen } from '@testing-library/react-native';
import { createRef } from 'react';
import { Text, View } from 'react-native';

import { ThemeProvider } from '../../../ThemeProvider/ThemeProvider';
import { LinearGradient } from './LinearGradient';

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
      {component}
    </ThemeProvider>,
  );
};

describe('LinearGradient', () => {
  it('should have correct display name', () => {
    expect(LinearGradient.displayName).toBe('LinearGradient');
  });

  it('should render children', () => {
    renderWithProvider(
      <LinearGradient stops={[{ color: '#FF6B6B' }, { color: '#4ECDC4' }]}>
        <Text>Child Content</Text>
      </LinearGradient>,
    );
    expect(screen.getByText('Child Content')).toBeTruthy();
  });

  it('should forward ref', () => {
    const ref = createRef<View>();
    renderWithProvider(
      <LinearGradient
        ref={ref}
        stops={[{ color: '#FF6B6B' }, { color: '#4ECDC4' }]}
      />,
    );
    expect(ref.current).toBeTruthy();
  });

  it('should resolve lx style tokens', () => {
    renderWithProvider(
      <LinearGradient
        testID='linear-gradient'
        stops={[{ color: '#FF6B6B' }, { color: '#4ECDC4' }]}
        lx={{ padding: 's16', marginTop: 's8' }}
      />,
    );
    const gradient = screen.getByTestId('linear-gradient');
    expect(gradient.props.style.padding).toBe(16);
    expect(gradient.props.style.marginTop).toBe(8);
  });

  it('should pass accessibility props', () => {
    renderWithProvider(
      <LinearGradient
        testID='linear-gradient'
        stops={[{ color: '#FF6B6B' }, { color: '#4ECDC4' }]}
        accessibilityLabel='Decorative gradient'
        accessible={false}
      />,
    );
    const gradient = screen.getByTestId('linear-gradient');
    expect(gradient.props.accessibilityLabel).toBe('Decorative gradient');
    expect(gradient.props.accessible).toBe(false);
  });
});
