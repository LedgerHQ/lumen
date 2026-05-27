import { primitiveColorTokens } from '../primitives/primitive.colors';

function typedKeys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}

type CryptoColorKey =
  | keyof (typeof primitiveColorTokens)['dark']['crypto']
  | keyof (typeof primitiveColorTokens)['dark']['crypto'];

export const extractCryptoGradients = (mode: 'dark' | 'light') => {
  const cryptoColors = primitiveColorTokens[mode].crypto;
  const cryptoTransparentColors = primitiveColorTokens[mode].cryptoTransparent;
  const keys = typedKeys(cryptoColors);

  return keys.reduce<{ [key in CryptoColorKey]: { color: string }[] }>(
    (acc, colorKey: CryptoColorKey) => {
      return {
        ...acc,
        [colorKey]: [
          {
            color: cryptoColors[colorKey as CryptoColorKey],
          },
          {
            color: cryptoTransparentColors[colorKey as CryptoColorKey],
          },
        ],
      };
    },
    {} as any,
  );
};
