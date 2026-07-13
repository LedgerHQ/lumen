import {
  resolveAvatarColorKey,
  type AvatarColorKey,
} from '@ledgerhq/lumen-utils-shared';

const AVATAR_HEX_COLORS: Record<AvatarColorKey, string> = {
  orange: '#f8b89b',
  green: '#aed09c',
  blue: '#afc6fe',
  purple: '#e2b9eb',
  red: '#ffb2b4',
  yellow: '#fbd98d',
  turquoise: '#96dde9',
  pink: '#f3b4db',
};

/**
 * Resolves a stable identifier (e.g. a user id) to one of the avatar pastel
 * hex colors. The same identifier always resolves to the same color.
 *
 * Pass the result directly to `<Avatar fallbackColor={resolveAvatarColor(id)} />`.
 */
export function resolveAvatarColor(identifier: string): string {
  return AVATAR_HEX_COLORS[resolveAvatarColorKey(identifier)];
}
