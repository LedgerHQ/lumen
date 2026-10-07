import { Button } from '@ledgerhq/lumen-ui-react';
import { cn } from '@ledgerhq/lumen-utils-shared';

export const Fixture = ({ size }: { size: string }) => (
  <div>
    <div className='flex foo-bar-baz' />
    <div className='lumen-fixture-known' />
    <div className='flex block' />
    <div className='w-[13px]' />
    <div className={`text-${size}`} />
    <div className={cn('flex', 'foo-bar-baz')} />
    <div style={{ color: 'red' }} />
    <Button className='p-4' />
  </div>
);
