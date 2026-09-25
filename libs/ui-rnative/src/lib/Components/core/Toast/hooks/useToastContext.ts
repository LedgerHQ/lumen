import { createSafeContext } from '@ledgerhq/lumen-utils-shared';
import type { ToastController } from '../types';

export const [ToastContextProvider, useToastContext] =
  createSafeContext<ToastController>('ToastProvider');
