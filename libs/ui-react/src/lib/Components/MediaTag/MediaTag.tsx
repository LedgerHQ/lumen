import { BaseTag } from '../BaseTag';
import type { MediaTagProps } from './types';

/**
 * A compact label used to categorize, classify, or highlight information with a required media element (image, crypto icon, etc.).
 *
 * The appearance determines the color scheme used.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/core-mediatag--docs Storybook}
 *
 * @example
 * import { MediaTag, MediaImage } from '@ledgerhq/lumen-ui-react';
 *
 * // MediaTag with image
 * <MediaTag
 *   label='Ethereum'
 *   leadingContent={<MediaImage src='https://crypto-icons.ledger.com/ETH.png' alt='Ethereum' size={16} shape='square' />}
 * />
 *
 * // Small MediaTag
 * <MediaTag label='Bitcoin' size='sm' leadingContent={myIcon} />
 */
export const MediaTag = ({ leadingContent, ...props }: MediaTagProps) => {
  return (
    <BaseTag
      {...props}
      variant='media'
      consumerName='MediaTag'
      leadingContent={leadingContent}
    />
  );
};
