import { ReactElement, ReactNode } from 'react';
import { PressableProps } from 'react-native';
import {
  StyledViewProps,
  StyledPressableProps,
  StyledTextProps,
} from '../../../styles';
import { BoxProps } from '../Utility';

export type SelectProps = {
  /**
   * The children of the select (SelectTrigger, SelectContent)
   */
  children: ReactNode;
  /**
   * The controlled open state of the select.
   * Must be used in conjunction with onOpenChange.
   */
  open?: boolean;
  /**
   * The value of the select when initially rendered.
   * Use when you do not need to control the state of the select.
   */
  defaultValue?: string;
  /**
   * Event handler called when the open state of the select changes.
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * The open state of the select when it is initially rendered.
   * Use when you do not need to control its open state.
   * @default false
   */
  defaultOpen?: boolean;
  /**
   * When true, prevents the user from interacting with select.
   */
  disabled?: boolean;
  /**
   * The controlled value of the select.
   * Should be used in conjunction with onValueChange.
   */
  value?: string;
  /**
   * Event handler called when the value changes.
   */
  onValueChange?: (value: string) => void;
};

export type SelectTriggerRenderProps = {
  /**
   * The currently selected value, or `undefined` if nothing is selected.
   */
  selectedValue: string | undefined;
  /**
   * The plain text extracted from `SelectItemText` for the selected item,
   * or `null` when nothing is selected or the value cannot be resolved.
   * This is text-only — it does not include icons or other rich content.
   */
  selectedContent: string | null;
};

export type SelectTriggerProps = {
  /**
   * The children to render inside the trigger
   */
  children?: ReactNode;
  /**
   * The label text that floats above the input when focused or filled
   * @example label='Select an option'
   */
  label?: string;
  /**
   * Render function that replaces the default input-style trigger.
   * The returned element receives `onPress` and `disabled` automatically.
   *
   * @example render={(props) => <SelectButtonTrigger {...props} label="Label" />}
   * @example render={({ selectedValue, selectedContent }) => <MyCustomTrigger />}
   */
  render?: (props: SelectTriggerRenderProps) => ReactElement;
  /**
   * Change the default rendered element for the one passed as a child,
   * merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & Omit<StyledPressableProps, 'children'>;

export type SelectContentProps = {
  /**
   * The children of the select content (SelectItem, SelectGroup, etc.)
   */
  children: ReactNode;
};

export type SelectGroupProps = {
  /**
   * The children of the select group (SelectLabel, SelectItem)
   */
  children: ReactNode;
} & StyledViewProps;

export type SelectLabelProps = {
  /**
   * The children of the select label
   * @required
   */
  children: ReactNode;
} & StyledTextProps;

export type SelectItemProps = {
  /**
   * The value of the select item
   * @required
   */
  value: string;
  /**
   * The children of the select item
   * @required
   */
  children: ReactNode;
  /**
   * Optional text used for display. Use this when the content is complex.
   */
  textValue?: string;
  /**
   * The disabled state of the select item
   */
  disabled?: boolean;
} & Omit<PressableProps, 'children' | 'onPress' | 'disabled'>;

export type SelectItemTextProps = {
  /**
   * The children of the select item text
   * @required
   */
  children: ReactNode;
} & StyledTextProps;

export type SelectSeparatorProps = {} & BoxProps;

export type SelectItemData = {
  type: 'item';
  value: string;
  label: string;
  content?: ReactNode;
  disabled?: boolean;
};

export type SelectGroupData = {
  type: 'group-label';
  label: string;
};

export type SelectSeparatorData = {
  type: 'separator';
};

export type SelectContentItem =
  | SelectItemData
  | SelectGroupData
  | SelectSeparatorData;

export type SelectData = {
  id: string;
  items: SelectContentItem[];
  selectedValue: string | undefined;
  onSelectValue: (value: string) => void;
  setOpen?: (open: boolean) => void;
  label?: string;
};
