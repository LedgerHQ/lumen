import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render, screen } from '@testing-library/react-native';
import type { ReactElement } from 'react';
import { View } from 'react-native';
import { RuntimeConstants } from '../../../utils';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { AddressInput } from './AddressInput';

const { body1 } = ledgerLiveThemes.dark.typographies.xs.body;

const renderWithProvider = (
  component: ReactElement,
): ReturnType<typeof render> => {
  return render(
    <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
      {component}
    </ThemeProvider>,
  );
};

describe('AddressInput', () => {
  describe('Prefix', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    const prefix = () => screen.getByText('To:');

    const prefixBox = () => {
      let node = prefix().parent;

      while (node && node.type !== View) {
        node = node.parent;
      }

      return node;
    };

    it('renders the default prefix', () => {
      renderWithProvider(<AddressInput placeholder='0x…' />);

      expect(prefix()).toBeTruthy();
    });

    it('sits the prefix on the first iOS line of a multiline field', () => {
      jest.spyOn(RuntimeConstants, 'isIOS', 'get').mockReturnValue(true);

      renderWithProvider(
        <AddressInput placeholder='0x…' multiline minLines={2} />,
      );

      expect(prefixBox()?.props.style).toEqual(
        expect.objectContaining({
          height: body1.lineHeight,
          justifyContent: 'flex-end',
        }),
      );
      expect(prefix().props.style.lineHeight).toBe(0);
    });
  });
});
