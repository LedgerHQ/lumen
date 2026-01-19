import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Settings,
  Plus,
  User,
  Apps,
  MoreVertical,
  ChevronRight,
} from '../../Symbols';
import { Tag } from '../Tag/Tag';
import {
  Tile,
  TileSpot,
  TileContent,
  TileTitle,
  TileDescription,
  TileSecondaryAction,
} from './Tile';

const meta: Meta<typeof Tile> = {
  component: Tile,
  subcomponents: {
    TileSecondaryAction,
    TileSpot,
    TileContent,
    TileTitle,
    TileDescription,
  },
  title: 'Containment/Tile',
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
    onClick: {
      action: 'clicked',
    },
    appearance: {
      control: 'select',
      options: ['no-background', 'card'],
    },
    disabled: {
      control: 'boolean',
    },
    centered: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tile>;

export const Base: Story = {
  args: {
    appearance: 'no-background',
    disabled: false,
    centered: false,
  },
  render: (args) => (
    <Tile {...args} className='w-112'>
      <TileSecondaryAction
        icon={MoreVertical}
        onClick={() => console.log('secondary action clicked')}
      />
      <TileSpot appearance='icon' icon={Settings} />
      <TileContent>
        <TileTitle>Item with Spot and Description</TileTitle>
        <TileDescription>Additional information</TileDescription>
      </TileContent>
    </Tile>
  ),
  parameters: {
    docs: {
      source: {
        code: `
<Tile appearance="no-background" className="w-112">
  <TileSecondaryAction
    icon={MoreVertical}
    onClick={() => console.log('secondary action clicked')}
  />
  <TileSpot appearance="icon" icon={Settings} />
  <TileContent>
    <TileTitle>Item with Spot and Description</TileTitle>
    <TileDescription>Additional information</TileDescription>
  </TileContent>
</Tile>
`,
      },
    },
  },
};

export const VariantsShowcase: Story = {
  render: () => (
    <div className='flex flex-col gap-16'>
      <Tile className='max-w-160'>
        <TileSecondaryAction
          icon={MoreVertical}
          onClick={() => console.log('secondary action clicked')}
        />
        <TileSpot appearance='icon' icon={User} />
        <TileContent>
          <TileTitle>User</TileTitle>
          <TileDescription>With description</TileDescription>
        </TileContent>
      </Tile>
      <Tile className='max-w-160'>
        <TileSecondaryAction
          icon={MoreVertical}
          onClick={() => console.log('secondary action clicked')}
        />
        <TileSpot appearance='icon' icon={Plus} />
        <TileContent>
          <TileTitle>Without Description</TileTitle>
        </TileContent>
      </Tile>
      <Tile className='max-w-160'>
        <TileSpot appearance='icon' icon={Settings} />
        <TileContent>
          <TileTitle>Without secondary action</TileTitle>
          <TileDescription>Additional information</TileDescription>
        </TileContent>
      </Tile>
      <Tile className='max-w-160'>
        <TileSecondaryAction
          icon={MoreVertical}
          onClick={() => console.log('secondary action clicked')}
        />
        <TileSpot appearance='icon' icon={Settings} />
        <TileContent>
          <TileTitle>With Trailing Content</TileTitle>
          <TileDescription>Additional information</TileDescription>
        </TileContent>
        <Tag label='Custom' appearance='base' />
      </Tile>
      <Tile className='max-w-160'>
        <TileSecondaryAction
          icon={MoreVertical}
          onClick={() => console.log('secondary action clicked')}
        />
        <TileSpot appearance='icon' icon={Settings} />
        <TileContent>
          <TileTitle>With Trailing Content</TileTitle>
          <TileDescription>Additional information</TileDescription>
        </TileContent>
        <div className='body-2-semi-bold text-success'>+7.87%</div>
      </Tile>
    </div>
  ),
};

export const HorizontalList: Story = {
  render: () => (
    <div className='flex flex-col gap-16'>
      <div className='flex w-480 bg-base'>
        {Array.from({ length: 3 }).map((_, i) => (
          <Tile key={`list-1-${i}`}>
            <TileSecondaryAction
              icon={MoreVertical}
              onClick={() => console.log('secondary action clicked')}
            />
            <TileSpot appearance='icon' icon={Apps} />
            <TileContent>
              <TileTitle>Item {i + 1}</TileTitle>
              <TileDescription>Description {i + 1}</TileDescription>
            </TileContent>
          </Tile>
        ))}
      </div>
      <div className='flex w-480 overflow-x-auto bg-base'>
        {Array.from({ length: 5 }).map((_, i) => (
          <Tile key={`list-2-${i}`} className='w-128 shrink-0'>
            <TileSecondaryAction
              icon={MoreVertical}
              onClick={() => console.log('secondary action clicked')}
            />
            <TileSpot appearance='icon' icon={Apps} />
            <TileContent>
              <TileTitle>{`Item ${i + 1}`}</TileTitle>
              <TileDescription>
                Long description that should truncate appropriately
              </TileDescription>
            </TileContent>
          </Tile>
        ))}
      </div>
    </div>
  ),
};

export const ResponsiveLayout: Story = {
  render: () => (
    <div className='flex w-full flex-col gap-16'>
      <div>
        <Tile>
          <TileSpot appearance='icon' icon={Apps} />
          <TileContent>
            <TileTitle>Item fill width</TileTitle>
            <TileDescription>Description fill width</TileDescription>
          </TileContent>
        </Tile>
      </div>
      <div className='flex items-center justify-center'>
        <Tile className='w-224'>
          <TileSpot appearance='icon' icon={Plus} />
          <TileContent>
            <TileTitle>Long Item with fixed width</TileTitle>
            <TileDescription>
              lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
              quos.
            </TileDescription>
          </TileContent>
        </Tile>
      </div>
    </div>
  ),
};

export const AppearanceShowcase: Story = {
  render: () => (
    <div className='flex flex-col gap-24'>
      <div>
        <h3 className='mb-8 heading-4'>No Background</h3>
        <div className='flex gap-16'>
          <Tile appearance='no-background' className='w-112'>
            <TileSpot appearance='icon' icon={Settings} />
            <TileContent>
              <TileTitle>Hover me</TileTitle>
              <TileDescription>Hover state</TileDescription>
            </TileContent>
          </Tile>
          <Tile appearance='no-background' disabled className='w-112'>
            <TileSpot appearance='icon' icon={Settings} />
            <TileContent>
              <TileTitle>Disabled</TileTitle>
              <TileDescription>Disabled state</TileDescription>
            </TileContent>
          </Tile>
        </div>
      </div>
      <div>
        <h3 className='mb-8 heading-4'>Card</h3>
        <div className='flex gap-16'>
          <Tile appearance='card' className='w-112'>
            <TileSpot appearance='icon' icon={User} />
            <TileContent>
              <TileTitle>Hover me</TileTitle>
              <TileDescription>Hover state</TileDescription>
            </TileContent>
          </Tile>
          <Tile appearance='card' disabled className='w-112'>
            <TileSpot appearance='icon' icon={User} />
            <TileContent>
              <TileTitle>Disabled</TileTitle>
              <TileDescription>Disabled state</TileDescription>
            </TileContent>
          </Tile>
        </div>
      </div>
    </div>
  ),
};

export const CenteredShowcase: Story = {
  render: () => (
    <div className='flex gap-8'>
      <Tile appearance='card' className='w-128'>
        <TileSpot appearance='icon' icon={Apps} />
        <TileContent>
          <TileTitle>Title</TileTitle>
          <TileDescription>Description</TileDescription>
        </TileContent>
        <Tag label='Label' appearance='base' />
      </Tile>
      <Tile appearance='card' className='w-128'>
        <TileSpot appearance='icon' icon={Apps} />
        <TileContent>
          <TileTitle>Title</TileTitle>
          <TileDescription>Description</TileDescription>
        </TileContent>
        <Tag label='Label' appearance='base' />
      </Tile>
      <Tile appearance='card' className='w-128'>
        <TileSpot appearance='icon' icon={Apps} />
        <TileContent>
          <TileTitle>Title</TileTitle>
          <TileDescription>Description</TileDescription>
        </TileContent>
        <Tag label='Label' appearance='base' />
      </Tile>
      <Tile appearance='card' centered className='w-128'>
        <TileSpot appearance='icon' icon={ChevronRight} />
        <TileContent>
          <TileTitle>Show more</TileTitle>
        </TileContent>
      </Tile>
    </div>
  ),
};
