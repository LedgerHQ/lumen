import {
  cn,
  DisabledProvider,
  useDisabledContext,
} from '@ledgerhq/lumen-utils-shared';
import { cva } from 'class-variance-authority';
import { useEffect, useState } from 'react';
import { useCommonTranslation } from '../../../i18n';
import { Close } from '../../Symbols';
import { InteractiveIcon } from '../InteractiveIcon';
import type {
  MediaBannerDescriptionProps,
  MediaBannerProps,
  MediaBannerTitleProps,
} from './types';

const mediaBannerVariants = cva(
  'relative flex h-72 w-full flex-row overflow-hidden rounded-md text-start select-none',
  {
    variants: {
      interactive: {
        true: 'cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
        false: 'cursor-default',
      },
      disabled: {
        false: 'bg-surface',
        true: 'bg-surface-disabled',
      },
    },
    compoundVariants: [
      {
        interactive: true,
        disabled: false,
        className: 'hover:bg-surface-hover active:bg-surface-pressed',
      },
    ],
    defaultVariants: { interactive: false, disabled: false },
  },
);

const mediaBannerTitleVariants = cva('line-clamp-1 body-2-semi-bold', {
  variants: {
    disabled: {
      false: 'text-base',
      true: 'text-disabled',
    },
  },
  defaultVariants: { disabled: false },
});

const mediaBannerDescriptionVariants = cva('line-clamp-2 body-3', {
  variants: {
    disabled: {
      false: 'text-muted',
      true: 'text-disabled',
    },
  },
  defaultVariants: { disabled: false },
});

/**
 * A promotional banner with a background image, title, description, and an optional close button.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/react-mediabanner--docs Storybook}
 */
export const MediaBanner = ({
  ref,
  imageUrl,
  onClose,
  closeAriaLabel,
  children,
  className,
  disabled: disabledProp = false,
  onClick,
  ...props
}: MediaBannerProps) => {
  const { t } = useCommonTranslation();
  const [imageLoadError, setImageLoadError] = useState(false);

  const disabled = useDisabledContext({
    consumerName: 'MediaBanner',
    mergeWith: { disabled: disabledProp },
  });

  useEffect(() => {
    setImageLoadError(false);
  }, [imageUrl]);

  const showImage = imageUrl && !imageLoadError;

  const Wrapper = (onClick ? 'button' : 'div') as 'button';

  return (
    <Wrapper
      ref={ref}
      {...(onClick ? { type: 'button' as const, disabled } : {})}
      onClick={onClick}
      className={cn(
        mediaBannerVariants({ interactive: !!onClick, disabled }),
        className,
      )}
      {...props}
    >
      <DisabledProvider value={{ disabled }}>
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
      </DisabledProvider>
      {onClose && (
        <InteractiveIcon
          data-testid='media-banner-close-button'
          type='button'
          iconType='stroked'
          appearance='white'
          icon={Close}
          size={16}
          className='absolute top-8 right-8'
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label={closeAriaLabel || t('components.banner.closeAriaLabel')}
        />
      )}
    </Wrapper>
  );
};

/**
 * The title of the MediaBanner. Clamps at 1 line.
 */
export const MediaBannerTitle = ({
  ref,
  children,
  className,
  ...props
}: MediaBannerTitleProps) => {
  const disabled = useDisabledContext({ consumerName: 'MediaBannerTitle' });

  return (
    <div
      ref={ref}
      className={cn(mediaBannerTitleVariants({ disabled }), className)}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * The description of the MediaBanner. Clamps at 2 lines.
 */
export const MediaBannerDescription = ({
  ref,
  children,
  className,
  ...props
}: MediaBannerDescriptionProps) => {
  const disabled = useDisabledContext({
    consumerName: 'MediaBannerDescription',
  });

  return (
    <div
      ref={ref}
      className={cn(mediaBannerDescriptionVariants({ disabled }), className)}
      {...props}
    >
      {children}
    </div>
  );
};
