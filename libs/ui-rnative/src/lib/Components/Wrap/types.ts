import { PropsWithChildren, ReactNode, ReactElement } from 'react';

export type WrapProps = PropsWithChildren & {
  if: boolean;
  with: (children: ReactNode) => ReactElement<any>;
};
