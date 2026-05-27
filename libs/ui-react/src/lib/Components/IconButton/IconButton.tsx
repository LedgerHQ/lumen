import { BaseButton } from '../Button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../Tooltip/Tooltip';
import type { IconButtonProps } from './types';

export const IconButton = ({
  ref,
  className,
  icon,
  tooltip = false,
  tooltipPlacement = 'top',
  tooltipText,
  onTooltipOpenChange,
  'aria-label': ariaLabel,
  ...props
}: IconButtonProps) => {
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
      <Tooltip onOpenChange={onTooltipOpenChange}>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent side={tooltipPlacement}>
          {tooltipText || ariaLabel}
        </TooltipContent>
      </Tooltip>
    );
  }

  return button;
};
