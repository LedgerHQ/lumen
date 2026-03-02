import { ButtonTrigger, type ButtonTriggerProps } from '../ButtonTrigger';
import type { SelectTriggerRenderProps } from './types';

export type SelectButtonTriggerProps = SelectTriggerRenderProps &
  Omit<ButtonTriggerProps, 'children'> & {
    /**
     * The label displayed when no value is selected.
     * Once a value is selected, it is replaced by the selected item's content.
     */
    label: string;
  };

export const SelectButtonTrigger = ({
  selectedValue,
  selectedContent,
  label,
  ...props
}: SelectButtonTriggerProps) => (
  <ButtonTrigger {...props}>
    {selectedValue ? selectedContent : label}
  </ButtonTrigger>
);
