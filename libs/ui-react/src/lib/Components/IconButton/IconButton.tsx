import React from 'react';
import { BaseButton } from '../Button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../Tooltip/Tooltip';
import { IconButtonProps } from './types';

export const IconButton = ({
  ref,
  className,
  icon,
  tooltip = false,
  tooltipPlacement = 'top',
  tooltipText,
  'aria-label': ariaLabel,
  ...props
}: IconButtonProps & {
  ref?: React.Ref<HTMLButtonElement>;
}) => {
  const button = (
    <BaseButton
      ref={ref}
      icon={icon}
      className={className}
      aria-label={ariaLabel}
      {...props}
    />
  );

  if (tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent side={tooltipPlacement}>
          {tooltipText || ariaLabel}
        </TooltipContent>
      </Tooltip>
    );
  }

  return button;
};

IconButton.displayName = 'IconButton';
