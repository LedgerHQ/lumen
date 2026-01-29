import { WrapProps } from './types';

export const Wrap = ({ if: condition, with: wrapper, children }: WrapProps) => {
  return condition ? wrapper(children) : children;
};
