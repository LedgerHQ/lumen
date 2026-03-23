import { cn } from '@ledgerhq/lumen-utils-shared';
import { useEffect, useState } from 'react';
import { useCommonTranslation } from '../../../i18n';
import { Close } from '../../Symbols';
import { InteractiveIcon } from '../InteractiveIcon';
import {
  MediaBannerDescriptionProps,
  MediaBannerProps,
  MediaBannerTitleProps,
} from './types';

/**
 * A promotional banner with a background image, title, description, and an optional close button.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/communication-mediabanner--docs Storybook}
 */
export const MediaBanner = ({
  ref,
  imageUrl,
  onClose,
  closeAriaLabel,
  children,
  className,
  ...props
}: MediaBannerProps) => {
  const { t } = useCommonTranslation();
  const [imageLoadError, setImageLoadError] = useState(false);

  useEffect(() => {
    setImageLoadError(false);
  }, [imageUrl]);

  const showImage = imageUrl && !imageLoadError;

  return (
    <div
      ref={ref}
      className={cn(
        'relative flex h-72 flex-row overflow-hidden rounded-md bg-surface',
        className,
      )}
      {...props}
    >
      <div className='flex flex-1 items-center px-12 py-2'>
        <div className='flex flex-col gap-4 py-12'>{children}</div>
      </div>
      <div className='relative w-128'>
        {showImage && (
          <img
            src={imageUrl}
            alt=''
            aria-hidden
            className='absolute inset-0 size-full object-cover'
            onError={() => setImageLoadError(true)}
          />
        )}
        <div className='absolute inset-0 bg-linear-[45deg] from-black/0 from-67% to-black/80' />
      </div>
      {onClose && (
        <InteractiveIcon
          type='button'
          iconType='stroked'
          appearance='white'
          className='absolute top-8 right-8'
          onClick={() => onClose()}
          aria-label={closeAriaLabel || t('components.banner.closeAriaLabel')}
        >
          <Close size={16} />
        </InteractiveIcon>
      )}
    </div>
  );
};

MediaBanner.displayName = 'MediaBanner';

/**
 * The title of the MediaBanner. Clamps at 1 line.
 */
export const MediaBannerTitle = ({
  ref,
  children,
  className,
  ...props
}: MediaBannerTitleProps) => {
  return (
    <div
      ref={ref}
      className={cn('line-clamp-1 body-2-semi-bold text-base', className)}
      {...props}
    >
      {children}
    </div>
  );
};

MediaBannerTitle.displayName = 'MediaBannerTitle';

/**
 * The description of the MediaBanner. Clamps at 2 lines.
 */
export const MediaBannerDescription = ({
  ref,
  children,
  className,
  ...props
}: MediaBannerDescriptionProps) => {
  return (
    <div
      ref={ref}
      className={cn('line-clamp-2 body-3 text-muted', className)}
      {...props}
    >
      {children}
    </div>
  );
};

MediaBannerDescription.displayName = 'MediaBannerDescription';
