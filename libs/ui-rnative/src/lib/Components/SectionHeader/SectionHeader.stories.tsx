import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Settings } from '../../Symbols';
import { Box } from '../Utility';
import {
  SectionHeader,
  SectionHeaderLeading,
  SectionHeaderTitle,
} from './SectionHeader';

const meta: Meta<typeof SectionHeader> = {
  component: SectionHeader,
  id: 'rnative-sectionheader',
  title: 'Core/SectionHeader',
  subcomponents: {
    SectionHeaderLeading,
    SectionHeaderTitle,
  },
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
    docs: {
      source: {
        language: 'tsx',
        format: true,
        type: 'dynamic',
      },
    },
  },
  argTypes: {
    appearance: {
      control: 'radio',
      options: ['no-background', 'card'],
    },
  },
  decorators: [
    (Story) => (
      <Box lx={{ padding: 's8', width: 's400' }}>
        <Story />
      </Box>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SectionHeader>;

export const Base: Story = {
  args: {
    appearance: 'no-background',
  },
  render: ({ appearance }) => (
    <SectionHeader appearance={appearance}>
      <SectionHeaderTitle>Label</SectionHeaderTitle>
    </SectionHeader>
  ),
};

export const NoBackground: Story = {
  render: () => (
    <SectionHeader>
      <SectionHeaderTitle>Label</SectionHeaderTitle>
    </SectionHeader>
  ),
};

export const Card: Story = {
  render: () => (
    <SectionHeader appearance='card'>
      <SectionHeaderTitle>Label</SectionHeaderTitle>
    </SectionHeader>
  ),
};

export const WithLeadingIcon: Story = {
  render: () => (
    <SectionHeader appearance='card'>
      <SectionHeaderLeading>
        <Settings size={16} color='muted' />
      </SectionHeaderLeading>
      <SectionHeaderTitle>Label</SectionHeaderTitle>
    </SectionHeader>
  ),
};
