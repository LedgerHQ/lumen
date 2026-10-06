import { Button } from '@ledgerhq/lumen-ui-react';
import { cn } from '@ledgerhq/lumen-utils-shared';

export const Fixture = ({ size }: { size: string }) => (
  <div>
    <div className='flex foo-bar-baz' />
    <div className='lumen-fixture-known' />
    <div className='flex block' />
    <svg fill='#ff0000' />
    <div className='w-[13px]' />
    <div className='bg-red-500' />
    <div className={`text-${size}`} />
    <div className={cn('flex', 'foo-bar-baz')} />
    <Input containerClassName='foo-bar-baz' />
    <div style={{ color: 'red' }} />
    <Button className='p-4' />
  </div>
);
