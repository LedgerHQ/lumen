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
};

export default meta;
type Story = StoryObj<typeof SectionHeader>;

export const NoBackground: Story = {
  render: () => (
    <Container>
      <SectionHeader>
        <SectionHeaderTitle>Label</SectionHeaderTitle>
      </SectionHeader>
    </Container>
  ),
};

export const Plain: Story = {
  render: () => (
    <Container>
      <SectionHeader appearance='plain'>
        <SectionHeaderTitle>Label</SectionHeaderTitle>
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
