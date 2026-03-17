import { cn, getButtonA11yProps } from '@ledgerhq/lumen-utils-shared';
import { useId, useState } from 'react';
import { useCommonTranslation } from '../../../i18n';
import { Close } from '../../Symbols/Icons/Close';
import { InteractiveIcon } from '../InteractiveIcon';
import { MediaCardProps } from './types';

const mediaCardStyles = {
  root: 'group relative flex h-[164px] w-full cursor-pointer flex-col items-start justify-end overflow-hidden rounded-md bg-muted p-12 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
  image: 'absolute inset-0 size-full object-cover',
  overlay:
    'absolute inset-0 size-full transition-colors group-hover:bg-muted-transparent-hover group-[:active:not(:has(button:active))]:bg-muted-transparent-pressed',
  content: 'isolate flex flex-col items-start gap-8',
  text: 'line-clamp-3 heading-3-semi-bold text-white',
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

/**
 * A media card component for displaying a full-bleed background image with
 * text, optional leading content, and a close button, using gradient
 * overlays to ensure readability.
 *
 * @example
 * import { MediaCard } from '@ledgerhq/lumen-ui-react';
 * import { Tag } from '@ledgerhq/lumen-ui-react';
 *
 * <MediaCard
 *   imageUrl="/image.jpg"
 *   text="Card text"
 *   leadingContent={<Tag label="New" size="md" />}
 *   onClick={() => {}}
 *   onClose={() => {}}
 * />
 */
export const MediaCard = ({
  ref,
  imageUrl,
  text,
  leadingContent,
  onClick,
  onClose,
  className,
  ...props
}: MediaCardProps) => {
  const { t } = useCommonTranslation();
  const closeLabelId = useId();
  const textId = useId();
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

      <div className={mediaCardStyles.content}>
        {leadingContent}
        <div id={textId} className={mediaCardStyles.text}>
          {text}
        </div>
      </div>

      <span id={closeLabelId} className='sr-only'>
        {t('common.closeAriaLabel')}
      </span>

      <InteractiveIcon
        type='button'
        iconType='stroked'
        aria-labelledby={`${closeLabelId} ${textId}`}
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
