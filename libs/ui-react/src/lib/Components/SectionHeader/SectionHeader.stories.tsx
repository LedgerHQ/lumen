import { cn } from '@ledgerhq/lumen-utils-shared';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { HTMLAttributes } from 'react';
import { Settings } from '../../Symbols';
import {
  SectionHeader,
  SectionHeaderLeading,
  SectionHeaderTitle,
} from './SectionHeader';

const Container = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('w-400 bg-canvas p-8 text-base', className)} {...props} />
);

const meta: Meta<typeof SectionHeader> = {
  component: SectionHeader,
  id: 'react-sectionheader',
  title: 'Core/SectionHeader',
  subcomponents: {
    SectionHeaderLeading,
    SectionHeaderTitle,
  },
  parameters: {
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
};

export default meta;
type Story = StoryObj<typeof SectionHeader>;

export const Base: Story = {
  args: {
    appearance: 'no-background',
  },
  render: ({ appearance }) => (
    <Container>
      <SectionHeader appearance={appearance}>
        <SectionHeaderTitle>Label</SectionHeaderTitle>
      </SectionHeader>
    </Container>
  ),
};

export const AppearanceShowcase: Story = {
  render: () => (
    <Container className='flex flex-col gap-8'>
      <SectionHeader>
        <SectionHeaderTitle>No background</SectionHeaderTitle>
      </SectionHeader>
      <SectionHeader appearance='plain'>
        <SectionHeaderTitle>Plain</SectionHeaderTitle>
      </SectionHeader>
    </Container>
  ),
};

export const WithLeadingIcon: Story = {
  render: () => (
    <Container>
      <SectionHeader appearance='plain'>
        <SectionHeaderLeading>
          <Settings size={16} />
        </SectionHeaderLeading>
        <SectionHeaderTitle>Label</SectionHeaderTitle>
      </SectionHeader>
    </Container>
  ),
};

export const TruncateShowcase: Story = {
  render: () => (
    <Container className='w-160'>
      <SectionHeader appearance='plain'>
        <SectionHeaderLeading>
          <Settings size={16} />
        </SectionHeaderLeading>
        <SectionHeaderTitle>
          Very long section header label that should truncate
        </SectionHeaderTitle>
      </SectionHeader>
    </Container>
  ),
};
