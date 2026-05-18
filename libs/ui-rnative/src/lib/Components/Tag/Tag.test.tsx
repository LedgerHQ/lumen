import { describe, it, expect, jest } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import type { IconProps } from '../Icon';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { Tag } from './Tag';

const renderWithProvider = (component: React.ReactElement) =>
  render(
    <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
      {component}
    </ThemeProvider>,
  );

describe('Tag Component', () => {
  it('should render without icon', () => {
    renderWithProvider(<Tag label='Label' />);
    expect(screen.getByText('Label')).toBeTruthy();
  });

  it('should render the icon component when icon prop is provided', () => {
    const Icon = jest.fn(({ size }: IconProps) => (
      <Text testID='tag-icon'>icon-{size}</Text>
    ));
    renderWithProvider(<Tag label='Label' icon={Icon} />);
    expect(screen.getByTestId('tag-icon')).toBeTruthy();
  });

  it('should inject size=16 into the icon when tag size is md', () => {
    const Icon = jest.fn(({ size }: IconProps) => (
      <Text testID='tag-icon'>icon-{size}</Text>
    ));
    renderWithProvider(<Tag label='Label' size='md' icon={Icon} />);
    expect(Icon).toHaveBeenCalledWith(
      expect.objectContaining({ size: 16 }),
      undefined,
    );
  });

  it('should inject size=12 into the icon when tag size is sm', () => {
    const Icon = jest.fn(({ size }: IconProps) => (
      <Text testID='tag-icon'>icon-{size}</Text>
    ));
    renderWithProvider(<Tag label='Label' size='sm' icon={Icon} />);
    expect(Icon).toHaveBeenCalledWith(
      expect.objectContaining({ size: 12 }),
      undefined,
    );
  });
});
