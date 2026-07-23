import { cn } from '@ledgerhq/lumen-utils-shared';
import { cva } from 'class-variance-authority';
import type { CSSProperties, ReactNode } from 'react';
import type { CurrencyInputSize } from '../types';

const currencyStyles = cva(
  [
    'cursor-text text-base',
    'group-has-[input:placeholder-shown]:text-muted-subtle',
    'group-has-[input:disabled]:cursor-not-allowed group-has-[input:disabled]:text-disabled',
    'group-has-[input[aria-invalid="true"]]:text-error',
  ],
  {
    variants: {
      size: {
        md: 'heading-0-semi-bold',
        sm: 'heading-2-semi-bold',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

type CurrencyLabelProps = {
  size: CurrencyInputSize;
  style: CSSProperties;
  children: ReactNode;
};

export const CurrencyLabel = ({
  size,
  style,
  children,
}: CurrencyLabelProps) => (
  <span className={cn(currencyStyles({ size }), 'shrink-0')} style={style}>
    {children}
  </span>
);
