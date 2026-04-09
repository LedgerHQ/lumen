import { cn, getButtonA11yProps } from '@ledgerhq/lumen-utils-shared';
import { cva } from 'class-variance-authority';
import { useEffect, useState } from 'react';
import { useCommonTranslation } from '../../../i18n';
import { Close } from '../../Symbols/Icons/Close';
import { InteractiveIcon } from '../InteractiveIcon';
import { MediaCardProps, MediaCardTitleProps } from './types';

const mediaCardVariants = {
  root: cva(
    [
      'group relative overflow-hidden rounded-md',
      'flex h-[164px] w-full flex-col items-start justify-end p-12',
      'bg-muted text-left',
    ],
    {
      variants: {
        interactive: {
          true: [
            'cursor-pointer',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
          ],
        },
      },
    },
  ),
  image: cva(['absolute inset-0', 'size-full object-cover']),
  overlay: cva([
    'absolute inset-0 size-full',
    'transition-colors',
    'group-hover:bg-muted-transparent-hover',
    'group-[:active:not(:has(button:active))]:bg-muted-transparent-pressed',
  ]),
  content: cva('isolate flex flex-col items-start gap-8'),
  title: cva('line-clamp-3 heading-3-semi-bold text-white'),
};

const GradientOverlays = () => {
  return (
    <>
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-x-0 bottom-0 h-3/4 bg-linear-to-t from-gradient-overlay-80 to-gradient-overlay-0'
      />

      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-y-0 right-0 size-full bg-linear-[45deg] from-gradient-overlay-0 from-70% to-gradient-overlay-80'
      />
    </>
  );
};

export const MediaCardTitle = ({
  ref,
  className,
  children,
  ...props
}: MediaCardTitleProps) => {
  return (
    <div
      ref={ref}
      className={cn(mediaCardVariants.title(), className)}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * A media card component for displaying a full-bleed background image with
 * composable content and a close button, using gradient overlays to ensure
 * readability.
 *
 * @example
 * import { MediaCard, MediaCardTitle } from '@ledgerhq/lumen-ui-react';
 * import { Tag } from '@ledgerhq/lumen-ui-react';
 *
 * <MediaCard
 *   imageUrl="/image.jpg"
 *   onClick={() => {}}
 *   onClose={() => {}}
 * >
 *   <Tag label="New" size="md" />
 *   <MediaCardTitle>Card text</MediaCardTitle>
 * </MediaCard>
 *
 * // Without close button
 * <MediaCard imageUrl="/image.jpg" onClick={() => {}}>
 *   <MediaCardTitle>Card text</MediaCardTitle>
 * </MediaCard>
 */
export const MediaCard = ({
  ref,
  imageUrl,
  children,
  onClick,
  onClose,
  closeAriaLabel,
  className,
  ...props
}: MediaCardProps) => {
  const { t } = useCommonTranslation();
  const [imageLoadError, setImageLoadError] = useState(false);
  const showImage = imageUrl && !imageLoadError;

  useEffect(() => {
    setImageLoadError(false);
  }, [imageUrl]);

  return (
    <div
      {...getButtonA11yProps({ onClick })}
      className={cn(
        mediaCardVariants.root({ interactive: !!onClick }),
        className,
      )}
      ref={ref}
      {...props}
    >
      {showImage && (
        <img
          src={imageUrl}
          alt=''
          className={mediaCardVariants.image()}
          aria-hidden='true'
          loading='lazy'
          onError={() => setImageLoadError(true)}
        />
      )}

      <GradientOverlays />

      <div aria-hidden='true' className={mediaCardVariants.overlay()} />

      <div className={mediaCardVariants.content()}>{children}</div>

      {onClose && (
        <InteractiveIcon
          type='button'
          iconType='stroked'
          appearance='white'
          icon={Close}
          size={20}
          aria-label={closeAriaLabel || t('common.closeAriaLabel')}
          className='absolute top-12 right-12 z-10'
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          onKeyDown={(e) => {
            e.stopPropagation();
          }}
        />
      )}
    </div>
  );
};
