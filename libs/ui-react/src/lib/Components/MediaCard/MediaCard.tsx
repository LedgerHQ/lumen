import { cn, getButtonA11yProps } from '@ledgerhq/lumen-utils-shared';
import { useState } from 'react';
import { useCommonTranslation } from '../../../i18n';
import { Close } from '../../Symbols/Icons/Close';
import { InteractiveIcon } from '../InteractiveIcon';
import { MediaCardProps, MediaCardTitleProps } from './types';

const mediaCardStyles = {
  root: 'group relative flex h-[164px] w-full cursor-pointer flex-col items-start justify-end overflow-hidden rounded-md bg-muted p-12 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
  image: 'absolute inset-0 size-full object-cover',
  overlay:
    'absolute inset-0 size-full transition-colors group-hover:bg-muted-transparent-hover group-[:active:not(:has(button:active))]:bg-muted-transparent-pressed',
  content: 'isolate flex flex-col items-start gap-8',
  title: 'line-clamp-3 heading-3-semi-bold text-white',
};

const GradientOverlays = () => {
  return (
    <>
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-x-0 bottom-0 h-3/4 bg-linear-to-t from-gradient-overlay-80 to-gradient-overlay-0'
      />

      <div
        className='pointer-events-none absolute top-0 right-0 h-full w-1/2'
        aria-hidden='true'
        style={{
          backgroundImage:
            'linear-gradient(42.53deg, transparent 70%, rgba(0, 0, 0, 0.80) 100%)',
        }}
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
    <div ref={ref} className={cn(mediaCardStyles.title, className)} {...props}>
      {children}
    </div>
  );
};

MediaCardTitle.displayName = 'MediaCardTitle';

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
 */
export const MediaCard = ({
  ref,
  imageUrl,
  children,
  onClick,
  onClose,
  className,
  ...props
}: MediaCardProps) => {
  const { t } = useCommonTranslation();
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      {...getButtonA11yProps({ onClick })}
      className={cn(mediaCardStyles.root, className)}
      ref={ref}
      {...props}
    >
      <img
        src={imageUrl}
        alt=''
        className={cn(mediaCardStyles.image, !imageLoaded && 'opacity-0')}
        aria-hidden='true'
        loading='lazy'
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageLoaded(false)}
      />

      {imageLoaded && <GradientOverlays />}

      <div aria-hidden='true' className={mediaCardStyles.overlay} />

      <div className={mediaCardStyles.content}>{children}</div>

      <InteractiveIcon
        type='button'
        iconType='stroked'
        aria-label={t('common.closeAriaLabel')}
        className='absolute top-12 right-12 z-10'
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.stopPropagation();
          }
        }}
      >
        <Close size={20} className='text-white' />
      </InteractiveIcon>
    </div>
  );
};

MediaCard.displayName = 'MediaCard';
