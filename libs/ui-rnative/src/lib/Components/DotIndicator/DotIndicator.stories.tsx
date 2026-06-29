import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Settings } from '../../Symbols';
import { Avatar } from '../Avatar/Avatar';
import { Button } from '../Button/Button';
import { getDotIconSize } from '../DotIcon';
import { IconButton } from '../IconButton/IconButton';
import { Box } from '../Utility/Box';
import { DotIndicator } from './DotIndicator';

const meta = {
  component: DotIndicator,
  id: 'rnative-dotindicator',
  title: 'Core/DotIndicator',
  parameters: {
    docs: {
      source: {
        language: 'tsx',
        format: true,
        type: 'code',
      },
    },
  },
  argTypes: {
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg', 'xl'],
    },
    appearance: {
      control: 'radio',
      options: ['base', 'red'],
    },
  },
} satisfies Meta<typeof DotIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {
    appearance: 'base',
  },
};

export const SizeShowcase: Story = {
  render: () => (
    <Box lx={{ flexDirection: 'row', alignItems: 'center', gap: 's12' }}>
      <DotIndicator size='sm' />
      <DotIndicator size='md' />
      <DotIndicator size='lg' />
      <DotIndicator size='xl' />
    </Box>
  ),
};

export const AppearanceShowcase: Story = {
  render: () => (
    <Box lx={{ flexDirection: 'row', alignItems: 'center', gap: 's12' }}>
      <DotIndicator appearance='base' />
      <DotIndicator appearance='red' />
      <DotIndicator disabled />
    </Box>
  ),
};

export const WithChildren: Story = {
  render: () => (
    <Box lx={{ flexDirection: 'row', alignItems: 'center', gap: 's12' }}>
      <DotIndicator appearance='red'>
        <Button size='sm'>Submit</Button>
      </DotIndicator>
      <DotIndicator size={getDotIconSize('avatar', 'md')}>
        <Avatar size='md' />
      </DotIndicator>
      <DotIndicator appearance='red'>
        <IconButton accessibilityLabel='Settings' icon={Settings} />
      </DotIndicator>
    </Box>
  ),
};
