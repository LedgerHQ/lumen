import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Apps, Chart1 } from '../../Symbols';
import { Button } from '../Button';
import {
  ListItem,
  ListItemContent,
  ListItemDescription,
  ListItemLeading,
  ListItemTitle,
} from '../ListItem';
import { SearchInput } from '../SearchInput';
import { Spot } from '../Spot';
import { Tile, TileContent, TileTitle } from '../Tile';
import {
  Dialog,
  DialogBody,
  DialogBodyStickyContent,
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

const meta: Meta<typeof Dialog> = {
  component: Dialog,
  title: 'Containment/Dialog',
  subcomponents: {
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogBody,
    DialogBodyStickyContent,
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
    <Dialog>
      <DialogTrigger asChild>
        <Button appearance='base'>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader
          density='compact'
          title='Sheet Title'
          description='Additional information'
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
// Uncontrolled — no open/onOpenChange state needed.
// Use DialogClose to dismiss the dialog from buttons.
<Dialog>
  <DialogTrigger asChild>
    <Button appearance="base">Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader
      density="compact"
      title="Sheet Title"
      description="Additional information"
    />
    <DialogBody>
      Content here ...
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

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button appearance='base'>Open Controlled Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader
            density='compact'
            title='Controlled Dialog'
            description='State is managed externally'
            onClose={() => setOpen(false)}
          />
          <DialogBody>
            <DialogContentTemplate />
          </DialogBody>
          <DialogFooter>
            <Button appearance='no-background' onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button appearance='base' onClick={() => setOpen(false)}>
              Done
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
// Controlled — manage open state yourself.
// Use onClose on DialogHeader and onClick handlers to close via state.
const [open, setOpen] = useState(false);

<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button appearance="base">Open Controlled Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader
      density="compact"
      title="Controlled Dialog"
      description="State is managed externally"
      onClose={() => setOpen(false)}
    />
    <DialogBody>
      Content here ...
    </DialogBody>
    <DialogFooter>
      <Button appearance="no-background" onClick={() => setOpen(false)}>
        Cancel
      </Button>
      <Button appearance="base" onClick={() => setOpen(false)}>
        Done
      </Button>
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
    return (
      <div className='flex gap-16'>
        <Dialog height='fit'>
          <DialogTrigger asChild>
            <Button appearance='base'>Fit (default)</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader
              density='compact'
              title='Fit Height'
              description='Content-fit height'
            />
            <DialogBody>
              <p className='body-2 text-muted'>
                The dialog height adjusts to fit the content, up to a maximum of
                560px.
              </p>
            </DialogBody>
          </DialogContent>
        </Dialog>

        <Dialog height='fixed'>
          <DialogTrigger asChild>
            <Button appearance='base'>Fixed</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader
              density='compact'
              title='Fixed Height'
              description='Always 560px'
            />
            <DialogBody>
              <p className='body-2 text-muted'>
                The dialog always has a fixed height of 560px, regardless of
                content.
              </p>
            </DialogBody>
          </DialogContent>
        </Dialog>

        <Dialog height='fixed'>
          <DialogTrigger asChild>
            <Button appearance='base'>Scrollable</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader
              density='compact'
              title='Scrollable Content'
              description='Fixed height with scroll'
            />
            <DialogBody>
              <div className='-mx-8 flex flex-col gap-4'>
                {Array.from({ length: 10 }).map((_, i) => (
                  <ListItem>
                    <ListItemLeading>
                      <Spot appearance='icon' icon={Chart1} />
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
    return (
      <div className='flex flex-wrap gap-16'>
        <Dialog height='fixed'>
          <DialogTrigger asChild>
            <Button appearance='base'>Open with Footer</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader
              density='compact'
              title='Scrollable Content'
              description='With fixed footer'
            />
            <DialogBody />
            <DialogFooter>
              <DialogClose asChild>
                <Button appearance='base' isFull>
                  Confirm
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog height='fixed'>
          <DialogTrigger asChild>
            <Button appearance='base'>Open with Multiple Buttons footer</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader
              density='compact'
              title='Scrollable Content'
              description='With fixed footer'
            />
            <DialogBody />
            <DialogFooter>
              <DialogClose asChild>
                <Button appearance='no-background'>Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button appearance='base'>Confirm</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  },
};

export const HeaderVariants: Story = {
  render: () => {
    return (
      <div className='flex flex-wrap gap-16'>
        <Dialog>
          <DialogTrigger asChild>
            <Button appearance='base'>Compact</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader
              density='compact'
              title='Sheet Title'
              description='Additional information'
            />
            <DialogBody>
              <DialogContentTemplate />
            </DialogBody>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button appearance='base'>Expanded</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader
              density='expanded'
              title='Sheet Title'
              description='Additional information'
            />
            <DialogBody>
              <DialogContentTemplate />
            </DialogBody>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button appearance='base'>Compact with Back</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader
              density='compact'
              title='Sheet Title'
              description='Additional information'
              onBack={() => console.log('Back clicked')}
            />
            <DialogBody>
              <DialogContentTemplate />
            </DialogBody>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button appearance='base'>Expanded with Back</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader
              density='expanded'
              title='Sheet Title'
              description='Additional information'
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
// Compact appearance (uncontrolled)
<Dialog>
  <DialogTrigger asChild>
    <Button appearance="base">Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader density="compact" title="Sheet Title" description="Additional information" />
    <DialogBody>
      Content here
    </DialogBody>
  </DialogContent>
</Dialog>

// Expanded appearance (uncontrolled)
<Dialog>
  <DialogTrigger asChild>
    <Button appearance="base">Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader density="expanded" title="Sheet Title" description="Additional information" />
    <DialogBody>
      Content here
    </DialogBody>
  </DialogContent>
</Dialog>

// With back button (uncontrolled)
<Dialog>
  <DialogTrigger asChild>
    <Button appearance="base">Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader 
      density="compact" 
      title="Sheet Title" 
      onBack={() => console.log('Back clicked')}
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
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState(1);

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
            density='expanded'
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
// Controlled — multi-step dialogs require state to manage steps and open/close.
// Use onClose on DialogHeader to close the dialog via state.
const [open, setOpen] = useState(false);
const [step, setStep] = useState(1);

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
      density="expanded"
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
    return (
      <Dialog height='fixed'>
        <DialogTrigger asChild>
          <Button appearance='base'>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader
            density='expanded'
            title='Browse Options'
            description='Description content is fixed to the top of the dialog'
            onBack={() => console.log('Back clicked')}
          />
          <DialogBody className='gap-32'>
            {/* Horizontal Tile List */}
            <div className='flex flex-col gap-8'>
              <h4 className='heading-5-semi-bold'>Quick Actions</h4>
              <div className='-mx-24 flex gap-8 overflow-x-auto px-24'>
                {Array.from({ length: 12 }).map((_, i) => (
                  <Tile>
                    <Spot appearance='icon' icon={Apps} />
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
                {Array.from({ length: 12 }).map((_, i) => (
                  <ListItem>
                    <ListItemLeading>
                      <Spot appearance='icon' icon={Chart1} />
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

export const WithStickyBodyContent: Story = {
  render: () => (
    <Dialog height='fixed'>
      <DialogTrigger asChild>
        <Button appearance='base'>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader
          density='expanded'
          title='Browse Options'
          description='Search stays visible while the list scrolls'
        />
        <DialogBody>
          <div className='-mx-8 flex flex-col gap-4'>
            <DialogBodyStickyContent className='bg-canvas'>
              <SearchInput className='mx-8' placeholder='Search item...' />
            </DialogBodyStickyContent>
            {Array.from({ length: 12 }).map((_, i) => (
              <ListItem key={i}>
                <ListItemLeading>
                  <Spot appearance='icon' icon={Chart1} />
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
  ),
};

export const WithScrollbar: Story = {
  render: () => (
    <Dialog height='fixed'>
      <DialogTrigger asChild>
        <Button appearance='base'>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader
          density='compact'
          title='Custom Scrollbar'
          description='Fixed height with styled scrollbar'
        />
        <DialogBody scrollbarWidth='auto'>
          <div className='-mx-8 flex flex-col gap-4'>
            {Array.from({ length: 10 }).map((_, i) => (
              <ListItem key={i}>
                <ListItemLeading>
                  <Spot appearance='icon' icon={Chart1} />
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
  ),
};

export const InfoStateVariants: Story = {
  render: () => {
    return (
      <div className='flex gap-16'>
        <Dialog>
          <DialogTrigger asChild>
            <Button appearance='base'>Error</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader density='compact' className='relative' />
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
              <DialogClose asChild>
                <Button appearance='base' size='lg' isFull>
                  Label
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button appearance='no-background' size='lg' isFull>
                  Label
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button appearance='base'>Success</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader density='compact' className='relative' />
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
              <DialogClose asChild>
                <Button appearance='base' size='lg' isFull>
                  Label
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button appearance='no-background' size='lg' isFull>
                  Label
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button appearance='base'>Muted</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader density='compact' className='relative' />
            <DialogBody>
              <div className='flex flex-col items-center gap-24 overflow-hidden'>
                <div className='pointer-events-none absolute inset-x-0 top-0 h-full bg-gradient-muted' />
                <Spot appearance='info' size={72} />
                <div className='flex flex-col items-center gap-12 text-center'>
                  <h3 className='heading-4-semi-bold text-base'>Title</h3>
                  <p className='body-2 text-muted'>Description</p>
                </div>
              </div>
            </DialogBody>
            <DialogFooter className='gap-8'>
              <DialogClose asChild>
                <Button appearance='base' size='lg' isFull>
                  Confirm
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button appearance='no-background' size='lg' isFull>
                  Cancel
                </Button>
              </DialogClose>
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
// Error state (uncontrolled)
<Dialog>
  <DialogTrigger asChild>
    <Button appearance="base">Open Error Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader density="compact" className="relative" />
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
      <DialogClose asChild>
        <Button appearance="base" size="lg" isFull>Label</Button>
      </DialogClose>
      <DialogClose asChild>
        <Button appearance="no-background" size="lg" isFull>Label</Button>
      </DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>

// Success state (uncontrolled)
<Dialog>
  <DialogTrigger asChild>
    <Button appearance="base">Open Success Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader density="compact" className="relative" />
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
      <DialogClose asChild>
        <Button appearance="base" size="lg" isFull>Label</Button>
      </DialogClose>
      <DialogClose asChild>
        <Button appearance="no-background" size="lg" isFull>Label</Button>
      </DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>

// Muted state (uncontrolled)
<Dialog>
  <DialogTrigger asChild>
    <Button appearance="base">Open Muted Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader density="compact" className="relative" />
    <DialogBody>
      <div className="flex flex-col items-center gap-24 overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-full bg-gradient-muted" />
        <Spot appearance="info" size={72} />
        <div className="flex flex-col items-center gap-12 text-center">
          <h3 className="heading-4-semi-bold text-base">Title</h3>
          <p className="body-2 text-muted">Description</p>
        </div>
      </div>
    </DialogBody>
    <DialogFooter className="gap-8">
      <DialogClose asChild>
        <Button appearance="base" size="lg" isFull>Confirm</Button>
      </DialogClose>
      <DialogClose asChild>
        <Button appearance="no-background" size="lg" isFull>Cancel</Button>
      </DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>
        `,
      },
    },
  },
};

