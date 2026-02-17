import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { Apps, Chart1 } from '../../Symbols';
import { Button } from '../Button';
import {
  ListItem,
  ListItemContent,
  ListItemDescription,
  ListItemLeading,
  ListItemSpot,
  ListItemTitle,
} from '../ListItem';
import { SearchInput } from '../SearchInput/SearchInput';
import { Spot } from '../Spot';
import { Tile, TileContent, TileSpot, TileTitle } from '../Tile';
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from './Dialog';

const DialogContentTemplate = () => {
  return (
    <div className='flex flex-col gap-16'>
      <p className='body-2 text-base'>
        The content area after the DialogHeader can contain any components.
        Ensure proper padding and scrolling if needed.
      </p>
      <div className='rounded-sm bg-muted p-12'>
        <p className='body-3 text-muted'>
          <strong className='body-3-semi-bold text-base'>Note:</strong> The
          dialog content defaults to a width of 400px and height auto-adjusts to
          content. Use the className prop on DialogContent to customize
          dimensions if needed.
        </p>
      </div>
    </div>
  );
};

const DialogTemplate = ({
  dialogHeaderProps,
  triggerLabel = 'Open Dialog',
}: {
  dialogHeaderProps: Omit<React.ComponentProps<typeof DialogHeader>, 'onClose'>;
  triggerLabel?: string;
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button appearance='base'>{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader
          {...dialogHeaderProps}
          appearance='extended'
          onClose={() => setOpen(false)}
        />
        <DialogBody>
          <DialogContentTemplate />
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};

const meta: Meta<typeof Dialog> = {
  component: Dialog,
  title: 'Containment/Dialog',
  subcomponents: {
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogBody,
    DialogFooter,
    DialogClose,
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
type Story = StoryObj<typeof Dialog>;

export const Base: Story = {
  render: () => (
    <DialogTemplate
      dialogHeaderProps={{
        appearance: 'compact',
        title: 'Sheet Title',
        description: 'Additional information',
        onBack: () => {
          return;
        },
      }}
    />
  ),
  parameters: {
    docs: {
      source: {
        code: `
<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button appearance="base">Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader 
      appearance="compact" 
      title="Sheet Title" 
      description="Additional information" 
      onClose={() => setOpen(false)} 
      onBack={() => goBack()}
    />
    <DialogBody>
      Content here ...
    </DialogBody>
    {/* Optional
      <DialogFooter>
        <Button appearance="base" size="lg" isFull>
          Label
        </Button>
      </DialogFooter>
    */}
  </DialogContent>
</Dialog>
        `,
      },
    },
  },
};

export const Uncontrolled: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button appearance='base'>Open Uncontrolled Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader
          appearance='compact'
          title='Uncontrolled Dialog'
          description='No state management needed'
        />
        <DialogBody>
          <DialogContentTemplate />
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button appearance='no-background'>Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button appearance='base'>Done</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      source: {
        code: `
// No open/onOpenChange state needed — fully uncontrolled
<Dialog>
  <DialogTrigger asChild>
    <Button appearance="base">Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader
      appearance="compact"
      title="Uncontrolled Dialog"
      description="No state management needed"
    />
    <DialogBody>
      Content here
    </DialogBody>
    <DialogFooter>
      <DialogClose asChild>
        <Button appearance="no-background">Cancel</Button>
      </DialogClose>
      <DialogClose asChild>
        <Button appearance="base">Done</Button>
      </DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>
        `,
      },
    },
  },
};

export const HeightLayouts: Story = {
  render: () => {
    const [openHug, setOpenHug] = React.useState(false);
    const [openFixed, setOpenFixed] = React.useState(false);
    const [openScrollable, setOpenScrollable] = React.useState(false);

    return (
      <div className='flex gap-16'>
        <Dialog height='hug' open={openHug} onOpenChange={setOpenHug}>
          <DialogTrigger asChild>
            <Button appearance='base'>Hug (default)</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader
              appearance='compact'
              title='Hug Height'
              description='Content-fit height'
              onClose={() => setOpenHug(false)}
            />
            <DialogBody>
              <p className='body-2 text-muted'>
                The dialog height adjusts to fit the content, up to a maximum of
                560px.
              </p>
            </DialogBody>
          </DialogContent>
        </Dialog>

        <Dialog height='fixed' open={openFixed} onOpenChange={setOpenFixed}>
          <DialogTrigger asChild>
            <Button appearance='base'>Fixed</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader
              appearance='compact'
              title='Fixed Height'
              description='Always 560px'
              onClose={() => setOpenFixed(false)}
            />
            <DialogBody>
              <p className='body-2 text-muted'>
                The dialog always has a fixed height of 560px, regardless of
                content.
              </p>
            </DialogBody>
          </DialogContent>
        </Dialog>

        <Dialog
          height='fixed'
          open={openScrollable}
          onOpenChange={setOpenScrollable}
        >
          <DialogTrigger asChild>
            <Button appearance='base'>Scrollable</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader
              appearance='compact'
              title='Scrollable Content'
              description='Fixed height with scroll'
              onClose={() => setOpenScrollable(false)}
            />
            <DialogBody>
              <div className='-mx-8 flex flex-col gap-4'>
                {Array.from({ length: 10 }).map((_, i) => (
                  <ListItem>
                    <ListItemLeading>
                      <ListItemSpot appearance='icon' icon={Chart1} />
                      <ListItemContent>
                        <ListItemTitle>Content item</ListItemTitle>
                        <ListItemDescription>{`item ${i + 1}.`}</ListItemDescription>
                      </ListItemContent>
                    </ListItemLeading>
                  </ListItem>
                ))}
              </div>
            </DialogBody>
          </DialogContent>
        </Dialog>
      </div>
    );
  },
};

export const WithFooter: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    const [openMultipleButtons, setOpenMultipleButtons] = React.useState(false);

    return (
      <div className='flex flex-wrap gap-16'>
        <Dialog height='fixed' open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button appearance='base'>Open with Footer</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader
              appearance='compact'
              title='Scrollable Content'
              description='With fixed footer'
              onClose={() => setOpen(false)}
            />
            <DialogBody />
            <DialogFooter>
              <Button appearance='base' isFull>
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog
          height='fixed'
          open={openMultipleButtons}
          onOpenChange={setOpenMultipleButtons}
        >
          <DialogTrigger asChild>
            <Button appearance='base'>Open with Multiple Buttons footer</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader
              appearance='compact'
              title='Scrollable Content'
              description='With fixed footer'
              onClose={() => setOpenMultipleButtons(false)}
            />
            <DialogBody />
            <DialogFooter>
              <Button
                appearance='no-background'
                onClick={() => setOpenMultipleButtons(false)}
              >
                Cancel
              </Button>
              <Button appearance='base'>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  },
};

export const HeaderVariants: Story = {
  render: () => {
    const [openCompact, setOpenCompact] = React.useState(false);
    const [openExtended, setOpenExtended] = React.useState(false);
    const [openCompactBack, setOpenCompactBack] = React.useState(false);
    const [openExtendedBack, setOpenExtendedBack] = React.useState(false);

    return (
      <div className='flex flex-wrap gap-16'>
        <Dialog open={openCompact} onOpenChange={setOpenCompact}>
          <DialogTrigger asChild>
            <Button appearance='base'>Compact</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader
              appearance='compact'
              title='Sheet Title'
              description='Additional information'
              onClose={() => setOpenCompact(false)}
            />
            <DialogBody>
              <DialogContentTemplate />
            </DialogBody>
          </DialogContent>
        </Dialog>

        <Dialog open={openExtended} onOpenChange={setOpenExtended}>
          <DialogTrigger asChild>
            <Button appearance='base'>Extended</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader
              appearance='extended'
              title='Sheet Title'
              description='Additional information'
              onClose={() => setOpenExtended(false)}
            />
            <DialogBody>
              <DialogContentTemplate />
            </DialogBody>
          </DialogContent>
        </Dialog>

        <Dialog open={openCompactBack} onOpenChange={setOpenCompactBack}>
          <DialogTrigger asChild>
            <Button appearance='base'>Compact with Back</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader
              appearance='compact'
              title='Sheet Title'
              description='Additional information'
              onClose={() => setOpenCompactBack(false)}
              onBack={() => console.log('Back clicked')}
            />
            <DialogBody>
              <DialogContentTemplate />
            </DialogBody>
          </DialogContent>
        </Dialog>

        <Dialog open={openExtendedBack} onOpenChange={setOpenExtendedBack}>
          <DialogTrigger asChild>
            <Button appearance='base'>Extended with Back</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader
              appearance='extended'
              title='Sheet Title'
              description='Additional information'
              onClose={() => setOpenExtendedBack(false)}
              onBack={() => console.log('Back clicked')}
            />
            <DialogBody>
              <DialogContentTemplate />
            </DialogBody>
          </DialogContent>
        </Dialog>
      </div>
    );
  },
  parameters: {
    docs: {
      source: {
        code: `
// Compact appearance
<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button appearance="base">Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader appearance="compact" title="Sheet Title" description="Additional information" onClose={() => setOpen(false)} />
    <DialogBody>
      Content here
    </DialogBody>
  </DialogContent>
</Dialog>

// Extended appearance
<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button appearance="base">Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader appearance="extended" title="Sheet Title" description="Additional information" onClose={() => setOpen(false)} />
    <DialogBody>
      Content here
    </DialogBody>
  </DialogContent>
</Dialog>

// With back button
<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button appearance="base">Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader 
      appearance="compact" 
      title="Sheet Title" 
      onBack={() => console.log('Back clicked')}
      onClose={() => setOpen(false)} 
    />
    <DialogBody>
      Content here
    </DialogBody>
  </DialogContent>
</Dialog>
        `,
      },
    },
  },
};

export const WithMultiSteps: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    const [step, setStep] = React.useState(1);

    const handleOpenChange = (isOpen: boolean) => {
      setOpen(isOpen);
      if (!isOpen) {
        setStep(1);
      }
    };

    return (
      <Dialog height='fixed' open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button appearance='base'>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader
            appearance='extended'
            title={step === 1 ? 'Step 1' : 'Step 2'}
            onClose={() => setOpen(false)}
            onBack={step > 1 ? () => setStep(step - 1) : undefined}
          />
          <DialogBody>
            <p className='body-2 text-base'>
              {step === 1
                ? 'Please review the information and click Continue to proceed.'
                : 'You are now on step 2. Use the back button to return to the previous step.'}
            </p>
          </DialogBody>
          <DialogFooter>
            <Button
              appearance='base'
              size='lg'
              isFull
              onClick={() => (step === 1 ? setStep(2) : setOpen(false))}
            >
              {step === 1 ? 'Continue' : 'Done'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
  parameters: {
    docs: {
      source: {
        code: `
const [open, setOpen] = React.useState(false);
const [step, setStep] = React.useState(1);

const handleOpenChange = (isOpen: boolean) => {
  setOpen(isOpen);
  if (!isOpen) {
    setStep(1);
  }
};

<Dialog height="fixed" open={open} onOpenChange={handleOpenChange}>
  <DialogTrigger asChild>
    <Button appearance="base">Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader
      appearance="extended"
      title={step === 1 ? 'Step 1' : 'Step 2'}
      onClose={() => setOpen(false)}
      onBack={step > 1 ? () => setStep(step - 1) : undefined}
    />
    <DialogBody>
          <p className="text-base body-2">
        {step === 1
          ? 'Please review the information and click Continue to proceed.'
          : 'You are now on step 2. Use the back button to return to the previous step.'}
      </p>
    </DialogBody>
    <DialogFooter>
      <Button
        appearance="base"
        size="lg"
        isFull
        onClick={() => (step === 1 ? setStep(2) : setOpen(false))}
      >
        {step === 1 ? 'Continue' : 'Done'}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
        `,
      },
    },
  },
};

export const WithListsContent: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);

    return (
      <Dialog height='fixed' open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button appearance='base'>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader
            appearance='extended'
            title='Browse Options'
            description='Description content is fixed to the top of the dialog'
            onBack={() => setOpen(false)}
            onClose={() => setOpen(false)}
          />
          <DialogBody className='gap-32'>
            {/* Horizontal Tile List */}
            <div className='flex flex-col gap-8'>
              <h4 className='heading-5-semi-bold'>Quick Actions</h4>
              <div className='-mx-24 flex gap-8 overflow-x-auto px-24'>
                {Array.from({ length: 12 }).map((_, i) => (
                  <Tile>
                    <TileSpot appearance='icon' icon={Apps} />
                    <TileContent>
                      <TileTitle>Action {i + 1}</TileTitle>
                    </TileContent>
                  </Tile>
                ))}
              </div>
            </div>

            {/* Vertical ListItem List */}
            <div className='flex flex-col gap-8'>
              <h4 className='heading-5-semi-bold'>Settings</h4>

              <div className='-mx-8 flex flex-col gap-4'>
                <div className='sticky top-0 bg-canvas py-8'>
                  <SearchInput className='mx-8' placeholder='Search item...' />
                </div>
                {Array.from({ length: 12 }).map((_, i) => (
                  <ListItem>
                    <ListItemLeading>
                      <ListItemSpot appearance='icon' icon={Chart1} />
                      <ListItemContent>
                        <ListItemTitle>Content item</ListItemTitle>
                        <ListItemDescription>{`item ${i + 1}.`}</ListItemDescription>
                      </ListItemContent>
                    </ListItemLeading>
                  </ListItem>
                ))}
              </div>
            </div>
          </DialogBody>
        </DialogContent>
      </Dialog>
    );
  },
};

export const InfoStateVariants: Story = {
  render: () => {
    const [openError, setOpenError] = React.useState(false);
    const [openSuccess, setOpenSuccess] = React.useState(false);

    return (
      <div className='flex gap-16'>
        <Dialog open={openError} onOpenChange={setOpenError}>
          <DialogTrigger asChild>
            <Button appearance='base'>Error</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader
              appearance='compact'
              onClose={() => setOpenError(false)}
              className='relative'
            />
            <DialogBody>
              <div className='flex flex-col items-center gap-24 overflow-hidden'>
                <div className='pointer-events-none absolute inset-x-0 top-0 h-full bg-gradient-error' />
                <Spot appearance='error' size={72} />
                <div className='flex flex-col items-center gap-12 text-center'>
                  <h3 className='heading-4-semi-bold text-base'>Title</h3>
                  <p className='body-2 text-muted'>Description</p>
                </div>
              </div>
            </DialogBody>
            <DialogFooter className='gap-8'>
              <Button appearance='base' size='lg' isFull>
                Label
              </Button>
              <Button appearance='no-background' size='lg' isFull>
                Label
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={openSuccess} onOpenChange={setOpenSuccess}>
          <DialogTrigger asChild>
            <Button appearance='base'>Success</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader
              appearance='compact'
              onClose={() => setOpenSuccess(false)}
              className='relative'
            />
            <DialogBody>
              <div className='flex flex-col items-center gap-24 overflow-hidden'>
                <div className='pointer-events-none absolute inset-x-0 top-0 h-full bg-gradient-success' />
                <Spot appearance='check' size={72} />
                <div className='flex flex-col items-center gap-12 text-center'>
                  <h3 className='heading-4-semi-bold text-base'>Title</h3>
                  <p className='body-2 text-muted'>Description</p>
                </div>
              </div>
            </DialogBody>
            <DialogFooter className='gap-8'>
              <Button appearance='base' size='lg' isFull>
                Label
              </Button>
              <Button appearance='no-background' size='lg' isFull>
                Label
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  },
  parameters: {
    docs: {
      source: {
        code: `
// Error state
<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button appearance="base">Open Error Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader appearance="compact" onClose={() => setOpen(false)} className="relative" />
    <DialogBody>
      <div className="flex flex-col items-center gap-24 overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-full bg-gradient-error" />
        <Spot appearance="error" size={72} />
        <div className="flex flex-col items-center gap-12 text-center">
          <h3 className="heading-4-semi-bold text-base">Title</h3>
          <p className="body-2 text-muted">Description</p>
        </div>
      </div>
    </DialogBody>
    <DialogFooter className="gap-8">
      <Button appearance="base" size="lg" isFull>Label</Button>
      <Button appearance="no-background" size="lg" isFull>Label</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

// Success state
<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button appearance="base">Open Success Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader appearance="compact" onClose={() => setOpen(false)} className="relative" />
    <DialogBody>
      <div className="flex flex-col items-center gap-24 overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-full bg-gradient-success" />
        <Spot appearance="check" size={72} />
        <div className="flex flex-col items-center gap-12 text-center">
          <h3 className="heading-4-semi-bold text-base">Title</h3>
          <p className="body-2 text-muted">Description</p>
        </div>
    </div>
    </DialogBody>
    <DialogFooter className="gap-8">
      <Button appearance="base" size="lg" isFull>Label</Button>
      <Button appearance="no-background" size="lg" isFull>Label</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
        `,
      },
    },
  },
};
