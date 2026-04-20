import type { LocalVariableCollection } from '@figma/rest-api-spec';
import type { LocalVariableCollectionMode } from './types.js';

export default function ledgerSpecificFileNameRenamer(
  collection: LocalVariableCollection,
  mode: LocalVariableCollectionMode,
): string {
  const sanitizedModeName = mode.name.split(' - ')[0].replace(/\s/g, '');
  return `${collection.name}.${sanitizedModeName}.json`;
}
