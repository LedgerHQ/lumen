import { cn, createSafeContext } from '@ledgerhq/lumen-utils-shared';
import { cva } from 'class-variance-authority';
import { t } from 'i18next';
import React, { forwardRef, useCallback } from 'react';
import { useControllableState } from '../../../utils/useControllableState';
import { ExpandRight, ExpandLeft } from '../../Symbols';
import { Tooltip, TooltipContent, TooltipTrigger } from '../Tooltip/Tooltip';
import {
  SideBarContextValue,
  SideBarProps,
  SideBarLeadingProps,
  SideBarTrailingProps,
  SideBarItemProps,
  SideBarCollapseToggleProps,
} from './types';

const [SideBarProvider, useSideBarContext] =
  createSafeContext<SideBarContextValue>('SideBar');

const sideBarVariants = {
  root: cva(
    [
      'flex h-full flex-col justify-between gap-16 overflow-y-auto rounded-xl bg-muted-transparent p-16',
      'transition-[width] duration-300 ease-in-out',
      'scrollbar-none',
    ],
    {
      variants: {
        collapsed: {
          true: 'w-72',
          false: 'w-208',
        },
      },
      defaultVariants: {
        collapsed: false,
      },
    },
  ),
  section: cva(['flex flex-col gap-16']),
  item: cva(
    [
      'flex h-44 w-full cursor-pointer items-center rounded-md p-12',
      'transition-all duration-300',
      'focus-visible:outline-2 focus-visible:outline-focus',
    ],
    {
      variants: {
        active: {
          true: 'bg-muted-transparent text-base body-2-semi-bold hover:bg-muted-transparent-hover active:bg-muted-transparent-pressed',
          false:
            'bg-base-transparent text-muted body-2 hover:bg-base-transparent-hover active:bg-base-transparent-pressed',
        },
        disabled: {
          true: 'cursor-default text-disabled hover:bg-base-transparent active:bg-base-transparent',
          false: '',
        },
      },
      defaultVariants: {
        active: false,
        disabled: false,
      },
    },
  ),
};

/**
 * A responsive sidebar navigation component with collapsible functionality.
 * Uses a composite pattern for maximum flexibility with value-based selection.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/components-sidebar--docs Storybook}
 *
 * @example
 * const [active, setActive] = useState('home');
 *
 * <SideBar active={active} onActiveChange={setActive}>
 *   <SideBarLeading>
 *     <SideBarItem value="home" icon={Home} activeIcon={HomeFill} label="Home" />
 *     <SideBarItem value="wallet" icon={Wallet} activeIcon={Wallet} label="Wallet" />
 *   </SideBarLeading>
 *   <SideBarTrailing>
 *     <SideBarItem value="settings" icon={SettingsAlt} activeIcon={SettingsAlt2} label="Settings" />
 *     <SideBarCollapseToggle />
 *   </SideBarTrailing>
 * </SideBar>
 */
export const SideBar = forwardRef<HTMLElement, SideBarProps>(
  (
    {
      collapsed: controlledCollapsed,
      defaultCollapsed = false,
      onCollapsedChange,
      active: controlledActive,
      defaultActive,
      onActiveChange,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const [collapsed, setCollapsed] = useControllableState({
      prop: controlledCollapsed,
      defaultProp: defaultCollapsed,
      onChange: onCollapsedChange,
    });

    const [active, setActive] = useControllableState({
      prop: controlledActive,
      defaultProp: defaultActive ?? '',
      onChange: onActiveChange,
    });

    return (
      <SideBarProvider
        value={{ collapsed, setCollapsed, active, onActiveChange: setActive }}
      >
        <nav
          ref={ref}
          className={cn(sideBarVariants.root({ collapsed }), className)}
          aria-label={t('components.sideBar.navigationAriaLabel')}
          {...props}
        >
          {children}
        </nav>
      </SideBarProvider>
    );
  },
);
SideBar.displayName = 'SideBar';

/**
 * Container for the leading (top) section of the sidebar.
 * Typically contains the main navigation items.
 */
export const SideBarLeading = forwardRef<HTMLDivElement, SideBarLeadingProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(sideBarVariants.section(), className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);
SideBarLeading.displayName = 'SideBarLeading';

/**
 * Container for the trailing (bottom) section of the sidebar.
 * Typically contains secondary navigation items and settings.
 * Uses `mt-auto` to push itself and the footer to the bottom.
 */
export const SideBarTrailing = forwardRef<HTMLDivElement, SideBarTrailingProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('mt-auto', sideBarVariants.section(), className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);
SideBarTrailing.displayName = 'SideBarTrailing';

/**
 * A navigation item within the sidebar.
 * Supports active state via value matching, icons, labels, and optional click handling.
 *
 * @example
 * // Basic usage with value-based selection
 * <SideBar active={active} onActiveChange={setActive}>
 *   <SideBarLeading>
 *     <SideBarItem value="home" icon={Home} activeIcon={HomeFill} label="Home" />
 *   </SideBarLeading>
 * </SideBar>
 *
 * @example
 * // With custom label content
 * <SideBarItem
 *   value="wallet"
 *   icon={Wallet}
 *   activeIcon={Wallet}
 *   label={<><span>Wallet</span><Tag color="accent" label="new" /></>}
 *   tooltipContent="Wallet"
 * />
 */
export const SideBarItem = forwardRef<HTMLButtonElement, SideBarItemProps>(
  (
    {
      value,
      icon: Icon,
      activeIcon: ActiveIcon,
      label,
      tooltipContent: tooltipContentProp,
      disabled = false,
      className,
      onClick,
      ...props
    },
    ref,
  ) => {
    const { collapsed, active, onActiveChange } = useSideBarContext({
      consumerName: 'SideBarItem',
      contextRequired: true,
    });

    const isActive = active === value;
    const IconComponent = isActive ? ActiveIcon : Icon;
    const tooltipContent = tooltipContentProp ?? label;

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled) return;
        onClick?.(event);
        onActiveChange?.(value);
      },
      [disabled, onClick, onActiveChange, value],
    );

    const content = (
      <>
        <IconComponent size={16} className='shrink-0' />
        {label != null && (
          <span
            className={cn(
              'truncate transition-all duration-200',
              collapsed ? 'ml-0 w-0 opacity-0' : 'ml-8 opacity-100',
            )}
          >
            {label}
          </span>
        )}
      </>
    );

    const item = (
      <button
        ref={ref}
        type='button'
        disabled={disabled}
        onClick={handleClick}
        className={cn(
          sideBarVariants.item({ active: isActive, disabled }),
          collapsed && 'w-fit',
          className,
        )}
        aria-current={isActive ? 'page' : undefined}
        {...props}
      >
        {content}
      </button>
    );

    if (collapsed && tooltipContent) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>{item}</TooltipTrigger>
          <TooltipContent side='right' sideOffset={8}>
            {tooltipContent}
          </TooltipContent>
        </Tooltip>
      );
    }

    return item;
  },
);
SideBarItem.displayName = 'SideBarItem';

/**
 * Collapse toggle button for the sidebar.
 * Place inside SideBarTrailing to allow users to collapse/expand the sidebar.
 *
 * @example
 * <SideBarTrailing>
 *   <SideBarCollapseToggle />
 * </SideBarTrailing>
 */
export const SideBarCollapseToggle = ({
  className,
  ...props
}: SideBarCollapseToggleProps) => {
  const { collapsed, setCollapsed } = useSideBarContext({
    consumerName: 'SideBarCollapseToggle',
    contextRequired: true,
  });

  const handleToggle = useCallback(() => {
    setCollapsed(!collapsed);
  }, [collapsed, setCollapsed]);

  const Icon = collapsed ? ExpandRight : ExpandLeft;

  const buttonContent = (
    <button
      type='button'
      onClick={handleToggle}
      className={cn(
        sideBarVariants.item({ active: false, disabled: false }),
        collapsed && 'w-fit',
        className,
      )}
      aria-label={
        collapsed
          ? t('components.sideBar.expandAriaLabel')
          : t('components.sideBar.collapseAriaLabel')
      }
      {...props}
    >
      <Icon size={16} className='shrink-0' />
    </button>
  );

  return buttonContent;
};
SideBarCollapseToggle.displayName = 'SideBarCollapseToggle';
