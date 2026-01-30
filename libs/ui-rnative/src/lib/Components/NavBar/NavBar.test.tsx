import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { NavBar } from './NavBar';

describe('NavBar', () => {
  it('renders correctly', () => {
    const { getByText } = render(<NavBar>Test</NavBar>);
    expect(getByText('Test')).toBeTruthy();
  });
});
