import { StyleProp, ViewStyle } from 'react-native';
import { StyledPressableProps } from '../../../styles';
import { IconSize } from '../Icon';

export type CardButtonProps = {
  /**
   * The visual style of the card button.
   */
  appearance?: 'base' | 'outline';
  /**
   * Whether the card button is disabled.
   */
  disabled?: boolean;
  /**
   * An optional icon component to render on the left side.
   */
  icon?: React.ComponentType<{ size?: IconSize; style?: StyleProp<ViewStyle> }>;
  /**
   * The main title of the card button.
   */
  title: string;
  /**
   * Optional descriptive text displayed below the title.
   */
  description?: string;
  /**
   * If true, hides the chevron arrow on the right side.
   */
  hideChevron?: boolean;
} & Omit<StyledPressableProps, 'disabled'>;
