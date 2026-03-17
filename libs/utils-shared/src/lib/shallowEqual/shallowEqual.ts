/**
 * Performs a shallow equality comparison between two objects.
 * Returns true if both objects have the same keys and each value
 * is strictly equal (using Object.is) to the corresponding value
 * in the other object.
 */
export function shallowEqual<T extends object>(a: T, b: T): boolean {
  if (Object.is(a, b)) return true;

  const objA = a as Record<string, unknown>;
  const objB = b as Record<string, unknown>;

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) return false;

  return keysA.every(
    (key) =>
      Object.prototype.hasOwnProperty.call(objB, key) &&
      Object.is(objA[key], objB[key]),
  );
}
