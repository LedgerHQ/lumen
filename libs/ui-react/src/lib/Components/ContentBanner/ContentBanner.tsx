import { cn } from '@ledgerhq/lumen-utils-shared';
import React from 'react';
import { useCommonTranslation } from '../../../i18n';
import { Close } from '../../Symbols';
import { InteractiveIcon } from '../InteractiveIcon';
import {
  ContentBannerContentProps,
  ContentBannerDescriptionProps,
  ContentBannerProps,
  ContentBannerTitleProps,
} from './types';

/**
 * Container for the text content (title and description) within the content banner.
 */
export const ContentBannerContent = React.forwardRef<
  HTMLDivElement,
  ContentBannerContentProps
>(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('flex min-w-0 flex-1 flex-col gap-4', className)}
      {...props}
    >
      {children}
    </div>
  );
});

ContentBannerContent.displayName = 'ContentBannerContent';

/**
 * The main title of the content banner.
 */
export const ContentBannerTitle = React.forwardRef<
  HTMLDivElement,
  ContentBannerTitleProps
>(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('line-clamp-2 body-2-semi-bold', className)}
      {...props}
    >
      {children}
    </div>
  );
});

ContentBannerTitle.displayName = 'ContentBannerTitle';

/**
 * Optional description text below the title.
 */
export const ContentBannerDescription = React.forwardRef<
  HTMLDivElement,
  ContentBannerDescriptionProps
>(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('line-clamp-2 body-3 text-muted', className)}
      {...props}
    >
      {children}
    </div>
  );
});

ContentBannerDescription.displayName = 'ContentBannerDescription';

/**
 * A content banner component for displaying a composable banner with an optional
 * leading visual, title, description, and close button.
 *
 * @example
 * import { ContentBanner, ContentBannerContent, ContentBannerTitle, ContentBannerDescription } from '@ledgerhq/lumen-ui-react';
 *
 * <ContentBanner onClose={() => {}}>
 *   <Spot appearance="icon" icon={Wallet} size={48} />
 *   <ContentBannerContent>
 *     <ContentBannerTitle>Title</ContentBannerTitle>
 *     <ContentBannerDescription>Description text</ContentBannerDescription>
 *   </ContentBannerContent>
 * </ContentBanner>
 */
export const ContentBanner = React.forwardRef<
  HTMLDivElement,
  ContentBannerProps
>(({ children, className, onClose, closeAriaLabel, ...props }, ref) => {
  const { t } = useCommonTranslation();

  return (
    <div
      ref={ref}
      className={cn(
        'relative flex w-full items-center gap-8 rounded-md bg-surface p-12',
        className,
      )}
      {...props}
    >
      {children}
      {onClose && (
        <InteractiveIcon
          iconType='filled'
          className='absolute top-8 right-8'
          onClick={() => onClose()}
          aria-label={
            closeAriaLabel || t('components.contentBanner.closeAriaLabel')
          }
        >
          <Close size={16} />
        </InteractiveIcon>
      )}
    </div>
  );
});

ContentBanner.displayName = 'ContentBanner';
