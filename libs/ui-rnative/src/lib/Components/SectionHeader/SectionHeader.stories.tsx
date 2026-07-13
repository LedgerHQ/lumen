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
      options: ['no-background', 'plain'],
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

export const AppearanceShowcase: Story = {
  render: () => (
    <Box lx={{ gap: 's8' }}>
      <SectionHeader>
        <SectionHeaderTitle>No background</SectionHeaderTitle>
      </SectionHeader>
      <SectionHeader appearance='plain'>
        <SectionHeaderTitle>Plain</SectionHeaderTitle>
      </SectionHeader>
    </Box>
  ),
};

export const WithLeadingIcon: Story = {
  render: () => (
    <SectionHeader appearance='plain'>
      <SectionHeaderLeading>
        <Settings size={16} color='muted' />
      </SectionHeaderLeading>
      <SectionHeaderTitle>Label</SectionHeaderTitle>
    </SectionHeader>
  ),
};

export const TruncateShowcase: Story = {
  render: () => (
    <Box lx={{ width: 's144' }}>
      <SectionHeader appearance='plain'>
        <SectionHeaderLeading>
          <Settings size={16} color='muted' />
        </SectionHeaderLeading>
        <SectionHeaderTitle>
          Very long section header label that should truncate
        </SectionHeaderTitle>
      </SectionHeader>
    </Box>
  ),
};
