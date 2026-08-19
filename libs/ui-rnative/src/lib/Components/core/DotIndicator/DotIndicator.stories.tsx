import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Box } from '../../primitives/Box';
import { Settings } from '../../symbols';
import { Avatar } from '../Avatar/Avatar';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import { DotIndicator } from './DotIndicator';
import { getDotIndicatorProps } from '.';

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
type Story = StoryObj<typeof DotIndicator>;

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
      <DotIndicator {...getDotIndicatorProps('avatar', 'md')}>
        <Avatar size='md' />
      </DotIndicator>
      <DotIndicator appearance='red'>
        <IconButton accessibilityLabel='Settings' icon={Settings} />
      </DotIndicator>
    </Box>
  ),
};
