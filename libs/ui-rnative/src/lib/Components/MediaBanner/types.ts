import { ReactNode } from 'react';
import { StyledTextProps } from '../../../styles';
import { PressableProps } from '../Utility';

export type MediaBannerProps = {
  children: ReactNode;
} & Omit<PressableProps, 'children'>;

export type MediaBannerTitleProps = {
  children: ReactNode;
} & Omit<StyledTextProps, 'children'>;

export type MediaBannerDescriptionProps = {
  children: ReactNode;
} & Omit<StyledTextProps, 'children'>;
