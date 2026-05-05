import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Settings } from '../../Symbols';
import { Avatar } from '../Avatar/Avatar';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import { Box } from '../Utility/Box';
import { DotIndicator } from './DotIndicator';

const meta = {
  component: DotIndicator,
  title: 'Communication/DotIndicator',
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
      options: ['xs', 'sm', 'md', 'lg'],
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
      <DotIndicator size='xs' />
      <DotIndicator size='sm' />
      <DotIndicator size='md' />
      <DotIndicator size='lg' />
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
      <DotIndicator appearance='red'>
        <Avatar size='md' />
      </DotIndicator>
      <DotIndicator appearance='red'>
        <IconButton accessibilityLabel='Settings' icon={Settings} />
      </DotIndicator>
    </Box>
  ),
};
