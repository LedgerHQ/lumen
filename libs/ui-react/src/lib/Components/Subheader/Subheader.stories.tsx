import { cn } from '@ledgerhq/lumen-utils-shared';
import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { Tooltip, TooltipTrigger, TooltipContent } from '../Tooltip/Tooltip';
import {
  Subheader,
  SubheaderRow,
  SubheaderTitle,
  SubheaderCount,
  SubheaderInfo,
  SubheaderShowMore,
  SubheaderDescription,
} from './Subheader';

const Container = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('w-400 bg-canvas p-8 text-base', className)} {...props} />
);

const meta: Meta<typeof Subheader> = {
  component: Subheader,
  title: 'Communication/Subheader',
  subcomponents: {
    SubheaderRow,
    SubheaderTitle,
    SubheaderDescription,
    SubheaderCount,
    SubheaderInfo,
    SubheaderShowMore,
  },
  parameters: {
    docs: {
      source: {
        language: 'tsx',
        format: true,
        type: 'code',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Subheader>;

export const Base: Story = {
  render: () => (
    <Container>
      <Subheader>
        <SubheaderRow>
          <SubheaderTitle>Section Title</SubheaderTitle>
        </SubheaderRow>
        <SubheaderDescription>
          This is a detailed description that provides additional context about
          this section.
        </SubheaderDescription>
      </Subheader>
    </Container>
  ),
  parameters: {
    docs: {
      source: {
        code: `
<Subheader>
  <SubheaderRow>
    <SubheaderTitle>Section Title</SubheaderTitle>
  </SubheaderRow>
  <SubheaderDescription>
    This is a detailed description that provides additional context about this section.
  </SubheaderDescription>
</Subheader>
        `,
      },
    },
  },
};

export const InteractiveRow: Story = {
  render: () => (
    <Container>
      <Subheader>
        <SubheaderRow onClick={() => console.log('Row clicked')}>
          <SubheaderTitle>Accounts</SubheaderTitle>
          <SubheaderCount value={5} />
          <SubheaderShowMore />
        </SubheaderRow>
        <SubheaderDescription>
          Interactive rows always include the chevron to indicate they lead to
          more content
        </SubheaderDescription>
      </Subheader>
    </Container>
  ),
  parameters: {
    docs: {
      source: {
        code: `
<Subheader>
  <SubheaderRow onClick={handleRowClick}>
    <SubheaderTitle>Accounts</SubheaderTitle>
    <SubheaderCount value={5} />
    <SubheaderShowMore />
  </SubheaderRow>
  <SubheaderDescription>
    Interactive rows always include the chevron to indicate they lead to more content
  </SubheaderDescription>
</Subheader>
        `,
      },
    },
  },
};

export const WithInfoIcon: Story = {
  render: () => (
    <Container>
      <Subheader>
        <SubheaderRow>
          <SubheaderTitle>Section with Info</SubheaderTitle>
          <Tooltip>
            <TooltipTrigger>
              <SubheaderInfo />
            </TooltipTrigger>
            <TooltipContent>
              Additional information about this section
            </TooltipContent>
          </Tooltip>
        </SubheaderRow>
        <SubheaderDescription>
          Use the info icon to provide contextual help or additional details
        </SubheaderDescription>
      </Subheader>
    </Container>
  ),
  parameters: {
    docs: {
      source: {
        code: `
<Subheader>
  <SubheaderRow>
    <SubheaderTitle>Section with Info</SubheaderTitle>
    <Tooltip>
      <TooltipTrigger>
        <SubheaderInfo />
      </TooltipTrigger>
      <TooltipContent>
        Additional information about this section
      </TooltipContent>
    </Tooltip>
  </SubheaderRow>
  <SubheaderDescription>
    Use the info icon to provide contextual help or additional details
  </SubheaderDescription>
</Subheader>
        `,
      },
    },
  },
};
