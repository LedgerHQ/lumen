import figma from '@figma/code-connect';
import React from 'react';
import { Button } from '../Button/Button';
import { Spot } from '../Spot/Spot';

/**
 * InfoState is a custom screen-level layout — there is no reusable component in Lumen.
 * It must be composed per-screen from existing design system primitives.
 * Code Connect is provided here so Figma Dev Mode shows the correct code snippet per variant.
 */

// content-preset=success
figma.connect(
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7/2.-Components-Library?node-id=1425-2784',
  {
    variant: { 'content-preset': 'success' },
    imports: [
      '/* ⚠️ CUSTOM LAYOUT ⚠️ — no reusable InfoState component exists in Lumen */',
      "import { Spot } from '@ledgerhq/lumen-ui-react'",
      "import { Button } from '@ledgerhq/lumen-ui-react'",
    ],
    example: () => (
      <div className='relative flex flex-col items-center gap-32 overflow-hidden px-16 py-24'>
        <div className='pointer-events-none absolute inset-x-0 top-0 h-full bg-gradient-success' />
        <div className='flex w-full flex-col items-center gap-24'>
          <Spot appearance='check' size={72} />
          <div className='flex flex-col items-center gap-8 text-center'>
            <h3 className='heading-4-semi-bold text-base'>Title</h3>
            <p className='body-2 text-muted'>Description</p>
          </div>
        </div>
        <div className='flex w-full flex-col items-center gap-16'>
          <Button
            appearance='base'
            size='lg'
            className='w-full'
            onClick={() => {}}
          >
            Label
          </Button>
          <Button
            appearance='gray'
            size='lg'
            className='w-full'
            onClick={() => {}}
          >
            Label
          </Button>
        </div>
      </div>
    ),
  },
);

// content-preset=error
figma.connect(
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7/2.-Components-Library?node-id=1425-2784',
  {
    variant: { 'content-preset': 'error' },
    imports: [
      '/* ⚠️ CUSTOM LAYOUT ⚠️ — no reusable InfoState component exists in Lumen */',
      "import { Spot } from '@ledgerhq/lumen-ui-react'",
      "import { Button } from '@ledgerhq/lumen-ui-react'",
    ],
    example: () => (
      <div className='relative flex flex-col items-center gap-32 overflow-hidden px-16 py-24'>
        <div className='pointer-events-none absolute inset-x-0 top-0 h-full bg-gradient-error' />
        <div className='flex w-full flex-col items-center gap-24'>
          <Spot appearance='error' size={72} />
          <div className='flex flex-col items-center gap-8 text-center'>
            <h3 className='heading-4-semi-bold text-base'>Title</h3>
            <p className='body-2 text-muted'>Description</p>
          </div>
        </div>
        <div className='flex w-full flex-col items-center gap-16'>
          <Button
            appearance='base'
            size='lg'
            className='w-full'
            onClick={() => {}}
          >
            Label
          </Button>
          <Button
            appearance='gray'
            size='lg'
            className='w-full'
            onClick={() => {}}
          >
            Label
          </Button>
        </div>
      </div>
    ),
  },
);

// content-preset=info
figma.connect(
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7/2.-Components-Library?node-id=1425-2784',
  {
    variant: { 'content-preset': 'info' },
    imports: [
      '/* ⚠️ CUSTOM LAYOUT ⚠️ — no reusable InfoState component exists in Lumen */',
      "import { Spot } from '@ledgerhq/lumen-ui-react'",
      "import { Button } from '@ledgerhq/lumen-ui-react'",
    ],
    example: () => (
      <div className='relative flex flex-col items-center gap-32 overflow-hidden px-16 py-24'>
        <div className='pointer-events-none absolute inset-x-0 top-0 h-full bg-gradient-muted' />
        <div className='flex w-full flex-col items-center gap-24'>
          <Spot appearance='info' size={72} />
          <div className='flex flex-col items-center gap-8 text-center'>
            <h3 className='heading-4-semi-bold text-base'>Title</h3>
            <p className='body-2 text-muted'>Description</p>
          </div>
        </div>
        <div className='flex w-full flex-col items-center gap-16'>
          <Button
            appearance='base'
            size='lg'
            className='w-full'
            onClick={() => {}}
          >
            Label
          </Button>
          <Button
            appearance='gray'
            size='lg'
            className='w-full'
            onClick={() => {}}
          >
            Label
          </Button>
        </div>
      </div>
    ),
  },
);

// content-preset=spot
figma.connect(
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7/2.-Components-Library?node-id=1425-2784',
  {
    variant: { 'content-preset': 'spot' },
    imports: [
      '/* ⚠️ CUSTOM LAYOUT ⚠️ — no reusable InfoState component exists in Lumen */',
      "import { Spot } from '@ledgerhq/lumen-ui-react'",
      "import { Button } from '@ledgerhq/lumen-ui-react'",
    ],
    example: () => (
      <div className='flex flex-col items-center gap-32 overflow-hidden px-16 py-24'>
        <div className='flex w-full flex-col items-center gap-24'>
          <Spot appearance='check' size={72} />
          <div className='flex flex-col items-center gap-8 text-center'>
            <h3 className='heading-4-semi-bold text-base'>Title</h3>
            <p className='body-2 text-muted'>Description</p>
          </div>
        </div>
        <div className='flex w-full flex-col items-center gap-16'>
          <Button
            appearance='base'
            size='lg'
            className='w-full'
            onClick={() => {}}
          >
            Label
          </Button>
          <Button
            appearance='gray'
            size='lg'
            className='w-full'
            onClick={() => {}}
          >
            Label
          </Button>
        </div>
      </div>
    ),
  },
);

// content-preset=illustration (no design system illustration component — use a custom placeholder)
figma.connect(
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7/2.-Components-Library?node-id=1425-2784',
  {
    variant: { 'content-preset': 'illustration' },
    imports: [
      '/* ⚠️ CUSTOM LAYOUT ⚠️ — no reusable InfoState component exists in Lumen */',
      "import { Button } from '@ledgerhq/lumen-ui-react'",
    ],
    example: () => (
      <div className='flex flex-col items-center gap-32 overflow-hidden px-16 py-24'>
        <div className='flex w-full flex-col items-center gap-24'>
          {/* Replace with your illustration */}
          <div className='size-208 rounded-md bg-muted' />
          <div className='flex flex-col items-center gap-8 text-center'>
            <h3 className='heading-4-semi-bold text-base'>Title</h3>
            <p className='body-2 text-muted'>Description</p>
          </div>
        </div>
        <div className='flex w-full flex-col items-center gap-16'>
          <Button
            appearance='base'
            size='lg'
            className='w-full'
            onClick={() => {}}
          >
            Label
          </Button>
          <Button
            appearance='gray'
            size='lg'
            className='w-full'
            onClick={() => {}}
          >
            Label
          </Button>
        </div>
      </div>
    ),
  },
);

// content-preset=text (no visual media — text only)
figma.connect(
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7/2.-Components-Library?node-id=1425-2784',
  {
    variant: { 'content-preset': 'text' },
    imports: [
      '/* ⚠️ CUSTOM LAYOUT ⚠️ — no reusable InfoState component exists in Lumen */',
      "import { Button } from '@ledgerhq/lumen-ui-react'",
    ],
    example: () => (
      <div className='flex flex-col items-center gap-32 overflow-hidden px-16 py-24'>
        <div className='flex flex-col items-center gap-8 text-center'>
          <h3 className='heading-4-semi-bold text-base'>Title</h3>
          <p className='body-2 text-muted'>Description</p>
        </div>
        <div className='flex w-full flex-col items-center gap-16'>
          <Button
            appearance='base'
            size='lg'
            className='w-full'
            onClick={() => {}}
          >
            Label
          </Button>
          <Button
            appearance='gray'
            size='lg'
            className='w-full'
            onClick={() => {}}
          >
            Label
          </Button>
        </div>
      </div>
    ),
  },
);
