import { ReactNode } from 'react';
import { StyledPressableProps, StyledTextProps } from '../../../styles';

export type MediaBannerProps = {
  imageUrl: string;
  onClose?: () => void;
  children: ReactNode;
} & Omit<StyledPressableProps, 'children'>;

export type MediaBannerTitleProps = {
  children: ReactNode;
} & Omit<StyledTextProps, 'children'>;

export type MediaBannerDescriptionProps = {
  children: ReactNode;
} & Omit<StyledTextProps, 'children'>;
