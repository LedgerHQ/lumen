import type { BaseInputCounterProps } from './types';

/**
 * Character counter rendered below the control inside `BaseInput`.
 *
 * @internal
 */
export const BaseInputCounter = ({
  count,
  maxCount,
}: BaseInputCounterProps) => {
  return (
    <span aria-live='polite' className='shrink-0 body-3 text-muted'>
      {`${count}/${maxCount}`}
    </span>
  );
};
