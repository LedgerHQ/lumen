import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render, screen } from '@testing-library/react-native';
import type { ReactElement } from 'react';
import { RuntimeConstants } from '../../../utils';
import { Pressable } from '../../primitives';
import { CheckmarkCircleFill } from '../../symbols/icons/CheckmarkCircleFill';
import { DeleteCircleFill } from '../../symbols/icons/DeleteCircleFill';
import { InformationFill } from '../../symbols/icons/InformationFill';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { TextInput } from './TextInput';
import type { TextInputProps } from './types';

const { colors, spacings, borderWidth } = ledgerLiveThemes.dark;
const { body1, body2 } = ledgerLiveThemes.dark.typographies.xs.body;

// A labelled field sets its value in body2 and reserves a row above it for the floated
// label; an unlabelled one — the shape AddressInput renders — sets it in body1 with no
// such row. Either way the padding and the borders fall outside the text box the line
// count applies to.
const geometries: {
  name: string;
  props: Partial<TextInputProps>;
  lineHeight: number;
  chrome: number;
}[] = [
  {
    name: 'labelled',
    props: { label: 'Note' },
    lineHeight: body2.lineHeight,
    chrome: spacings.s16 + 2 * spacings.s6 + 2 * borderWidth.s2,
  },
  {
    name: 'unlabelled',
    props: {},
    lineHeight: body1.lineHeight,
    chrome: 2 * spacings.s12 + 2 * borderWidth.s2,
  },
];

const renderWithProvider = (
  component: ReactElement,
): ReturnType<typeof render> => {
  return render(
    <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
      {component}
    </ThemeProvider>,
  );
};

describe('TextInput', () => {
  describe('Placeholder and label (BaseInput parity with web)', () => {
    it('uses the provided placeholder when label and placeholder are both set', async () => {
      await renderWithProvider(
        <TextInput
          label='Username'
          placeholder='jane.doe'
          value=''
          onChangeText={() => {}}
        />,
      );

      expect(screen.getByPlaceholderText('jane.doe')).toBeTruthy();
    });
  });

  describe('Helper text', () => {
    it('renders neutral helper text with an info icon', () => {
      renderWithProvider(
        <TextInput label='Address' helperText='Enter your ETH address' />,
      );

      const helperText = screen.getByText('Enter your ETH address');

      expect(helperText).toBeTruthy();
      expect(helperText.props.style).toEqual(
        expect.objectContaining({ color: colors.text.muted }),
      );
      expect(screen.UNSAFE_getByType(InformationFill)).toBeTruthy();
      expect(screen.UNSAFE_queryByType(DeleteCircleFill)).toBeNull();
      expect(screen.UNSAFE_queryByType(CheckmarkCircleFill)).toBeNull();
    });

    it('renders error helper text with an error icon', () => {
      renderWithProvider(
        <TextInput
          label='Address'
          helperText='Invalid address format'
          status='error'
        />,
      );

      const helperText = screen.getByText('Invalid address format');

      expect(helperText.props.style).toEqual(
        expect.objectContaining({ color: colors.text.error }),
      );
      expect(screen.UNSAFE_getByType(DeleteCircleFill)).toBeTruthy();
      expect(screen.UNSAFE_queryByType(CheckmarkCircleFill)).toBeNull();
    });

    it('renders success helper text with a success icon', () => {
      renderWithProvider(
        <TextInput
          label='Address'
          helperText='Address verified'
          status='success'
        />,
      );

      const helperText = screen.getByText('Address verified');

      expect(helperText.props.style).toEqual(
        expect.objectContaining({ color: colors.text.success }),
      );
      expect(screen.UNSAFE_getByType(CheckmarkCircleFill)).toBeTruthy();
      expect(screen.UNSAFE_queryByType(DeleteCircleFill)).toBeNull();
    });
  });

  describe('Character counter', () => {
    it('renders character counter when maxCount is set', () => {
      renderWithProvider(
        <TextInput
          label='Bio'
          value='Hello'
          onChangeText={() => {}}
          maxCount={32}
        />,
      );

      expect(screen.getByText('5/32')).toBeTruthy();
    });

    it('does not render character counter when maxCount is omitted', () => {
      renderWithProvider(
        <TextInput label='Bio' value='Hello' onChangeText={() => {}} />,
      );

      expect(screen.queryByText(/\d+\/\d+/)).toBeNull();
    });

    it('keeps counter muted when count exceeds maxCount', () => {
      const longValue = 'This text exceeds the character limit';

      renderWithProvider(
        <TextInput
          label='Bio'
          value={longValue}
          onChangeText={() => {}}
          maxCount={32}
        />,
      );

      const counter = screen.getByText(`${longValue.length}/32`);

      expect(counter.props.style).toEqual(
        expect.objectContaining({ color: colors.text.muted }),
      );
    });

    it('does not truncate input when count exceeds maxCount', () => {
      const longValue = 'This text exceeds the character limit';

      renderWithProvider(
        <TextInput
          label='Bio'
          value={longValue}
          onChangeText={() => {}}
          maxCount={32}
        />,
      );

      expect(screen.getByDisplayValue(longValue)).toBeTruthy();
    });
  });

  describe('Read-only', () => {
    it('shows the clear button when it has content and is editable', () => {
      renderWithProvider(
        <TextInput label='Company' value='Ledger' onChangeText={() => {}} />,
      );

      expect(screen.UNSAFE_getByType(DeleteCircleFill)).toBeTruthy();
    });

    it('sets the input to editable={false} and hides the clear button when readOnly', () => {
      renderWithProvider(
        <TextInput
          label='Company'
          value='Ledger'
          onChangeText={() => {}}
          readOnly
        />,
      );

      expect(screen.getByDisplayValue('Ledger').props.editable).toBe(false);
      expect(screen.UNSAFE_queryByType(DeleteCircleFill)).toBeNull();
    });
  });

  // The height itself is native, so the bounds are all these tests can reach: the
  // container carries the minLines floor, the input box carries the ceiling.
  describe('Multiline', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    const field = () => screen.getByPlaceholderText('Write a note');
    const container = () => screen.UNSAFE_getByType(Pressable);

    const renderMultiline = (props: Partial<TextInputProps> = {}) =>
      renderWithProvider(
        <TextInput
          placeholder='Write a note'
          value=''
          onChangeText={() => {}}
          {...props}
        />,
      );

    it('stays single-line by default', () => {
      renderMultiline({ label: 'Note' });

      const { multiline, style } = field().props;

      expect(multiline).toBeFalsy();
      expect(style.minHeight).toBeUndefined();
    });

    describe.each(geometries)('$name', ({ props, lineHeight, chrome }) => {
      const renderCase = (extra: Partial<TextInputProps> = {}) =>
        renderMultiline({ ...props, multiline: true, ...extra });

      it('floors the field at minLines and leaves it unbounded above', () => {
        renderCase({ minLines: 2 });

        expect(field().props.multiline).toBe(true);
        expect(container().props.style.minHeight).toBe(2 * lineHeight + chrome);
        expect(field().props.style.maxHeight).toBeUndefined();
      });

      // A box taller than its text would drop the value below the placeholder on
      // Android, which centres a line within its box.
      it('keeps the input box a single line whatever the floor is', () => {
        renderCase({ minLines: 3 });

        expect(field().props.style.minHeight).toBe(lineHeight);
      });

      it('caps the growth at maxLines', () => {
        renderCase({ minLines: 2, maxLines: 4 });

        expect(container().props.style.minHeight).toBe(2 * lineHeight + chrome);
        expect(field().props.style.maxHeight).toBe(4 * lineHeight);
      });

      it('gives a fixed box when minLines and maxLines match', () => {
        renderCase({ minLines: 3, maxLines: 3 });

        expect(container().props.style.minHeight).toBe(3 * lineHeight + chrome);
        expect(field().props.style.maxHeight).toBe(3 * lineHeight);
      });

      it('lets maxLines win over a taller minLines', () => {
        renderCase({ minLines: 5, maxLines: 2 });

        expect(container().props.style.minHeight).toBe(2 * lineHeight + chrome);
        expect(field().props.style.maxHeight).toBe(2 * lineHeight);
      });

      it('takes the token line height on Android', () => {
        jest.spyOn(RuntimeConstants, 'isAndroid', 'get').mockReturnValue(true);

        renderCase();

        expect(field().props.style.lineHeight).toBe(lineHeight);
      });

      it('leaves the line height natural on iOS', () => {
        jest.spyOn(RuntimeConstants, 'isIOS', 'get').mockReturnValue(true);

        renderCase();

        expect(field().props.style.lineHeight).toBe(0);
      });
    });

    it('still renders the clear button and the counter', () => {
      renderMultiline({
        label: 'Note',
        multiline: true,
        minLines: 2,
        value: 'Hello',
        maxCount: 32,
      });

      expect(screen.UNSAFE_getByType(DeleteCircleFill)).toBeTruthy();
      expect(screen.getByText('5/32')).toBeTruthy();
    });
  });
});
