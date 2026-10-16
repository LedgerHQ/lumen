import type { Meta, StoryObj } from '@storybook/react-vite';
import { Link } from '../Link/Link';
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

const meta = {
  component: Subheader,
  id: 'react-subheader',
  title: 'Core/Subheader',
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
        type: 'dynamic',
      },
    },
  },
} satisfies Meta<typeof Subheader>;

export default meta;
type Story = StoryObj<typeof Subheader>;

export const Base: StoryObj<{ title: string; description: string }> = {
  args: {
    title: 'Section Title',
    description:
      'This is a detailed description that provides additional context about this section.',
  },
  render: ({ title, description }) => (
    <div className='w-400 bg-canvas p-8 text-base'>
      <Subheader>
        <SubheaderRow>
          <SubheaderTitle>{title}</SubheaderTitle>
        </SubheaderRow>
        <SubheaderDescription>{description}</SubheaderDescription>
      </Subheader>
    </div>
  ),
};

export const InteractiveRow: Story = {
  render: () => (
    <div className='w-400 bg-canvas p-8 text-base'>
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
    </div>
  ),
};

export const WithInfoIcon: Story = {
  render: () => (
    <div className='w-400 bg-canvas p-8 text-base'>
      <Subheader>
        <SubheaderRow>
          <SubheaderTitle>Section with Info</SubheaderTitle>
          <Tooltip>
            <TooltipTrigger aria-label='Open tooltip'>
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
    </div>
  ),
};

export const WithAction: Story = {
  render: () => (
    <div className='w-400 bg-canvas p-8 text-base'>
      <Subheader>
        <div className='flex w-full items-center justify-between gap-24'>
          <SubheaderRow className='min-w-0 flex-1'>
            <SubheaderTitle>Recent Activity</SubheaderTitle>
          </SubheaderRow>
          <Link
            href='#'
            appearance='accent'
            size='sm'
            underline={false}
            className='shrink-0'
            onClick={(e) => {
              e.preventDefault();
              console.log('View all clicked');
            }}
          >
            View all
          </Link>
        </div>
        <SubheaderDescription>
          Place the action link in a flex layout beside the subheader
        </SubheaderDescription>
      </Subheader>
    </div>
  ),
};
