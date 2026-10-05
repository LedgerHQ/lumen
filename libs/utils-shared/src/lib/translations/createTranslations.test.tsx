import { cleanup, render, screen } from '@testing-library/react';
import { createTranslations } from './createTranslations';

const en = {
  common: { close: 'Close' },
  pagination: { page: 'Page {{page}}' },
  trend: { up: 'Trend up {{value}}' },
};

const fr = {
  common: { close: 'Fermer' },
  pagination: { page: 'Page {{page}}' },
};

type Locale = 'en' | 'fr';

const { TranslationsProvider, useTranslations, translate } = createTranslations<
  Locale,
  typeof en
>({
  dictionaries: { en, fr },
  defaultLocale: 'en',
});

const Label = ({ translationKey }: { translationKey: 'common.close' }) => {
  const { t, locale } = useTranslations();
  return (
    <span data-testid='label' data-locale={locale}>
      {t(translationKey)}
    </span>
  );
};

afterEach(() => {
  cleanup();
});

describe('createTranslations', () => {
  describe('translate', () => {
    it('resolves a nested key in the given locale', () => {
      expect(translate('fr', 'common.close')).toBe('Fermer');
    });

    it('interpolates params', () => {
      expect(translate('en', 'pagination.page', { page: 4 })).toBe('Page 4');
    });

    it('falls back to the fallback locale for a missing key', () => {
      expect(translate('fr', 'trend.up', { value: '2.00%' })).toBe(
        'Trend up 2.00%',
      );
    });

    it('returns the key when no locale has it', () => {
      // @ts-expect-error unknown keys are a type error
      expect(translate('en', 'common.unknown')).toBe('common.unknown');
    });

    it('returns the key when it points to a group, not a string', () => {
      // @ts-expect-error groups are not translation keys
      expect(translate('en', 'common')).toBe('common');
    });

    it('uses a separate fallback locale when one is given', () => {
      const translations = createTranslations<Locale, typeof en>({
        dictionaries: { en: { common: { close: 'Close' } }, fr },
        defaultLocale: 'en',
        fallbackLocale: 'fr',
      });

      expect(translations.translate('en', 'pagination.page', { page: 1 })).toBe(
        'Page 1',
      );
    });
  });

  describe('useTranslations', () => {
    it('returns keys as-is without a provider', () => {
      render(<Label translationKey='common.close' />);

      expect(screen.getByTestId('label').textContent).toBe('common.close');
      expect(screen.getByTestId('label').getAttribute('data-locale')).toBe(
        'en',
      );
    });

    it('uses the provider locale on the first render', () => {
      render(
        <TranslationsProvider locale='fr'>
          <Label translationKey='common.close' />
        </TranslationsProvider>,
      );

      expect(screen.getByTestId('label').textContent).toBe('Fermer');
    });

    it('uses the default locale when the provider has none', () => {
      render(
        <TranslationsProvider>
          <Label translationKey='common.close' />
        </TranslationsProvider>,
      );

      expect(screen.getByTestId('label').textContent).toBe('Close');
    });

    it('resolves a regional or unsupported locale', () => {
      const { rerender } = render(
        <TranslationsProvider locale={'fr-CA' as Locale}>
          <Label translationKey='common.close' />
        </TranslationsProvider>,
      );
      expect(screen.getByTestId('label').textContent).toBe('Fermer');

      rerender(
        <TranslationsProvider locale={'it' as Locale}>
          <Label translationKey='common.close' />
        </TranslationsProvider>,
      );
      expect(screen.getByTestId('label').textContent).toBe('Close');
    });

    it('re-renders when the provider locale changes', () => {
      const { rerender } = render(
        <TranslationsProvider locale='en'>
          <Label translationKey='common.close' />
        </TranslationsProvider>,
      );
      expect(screen.getByTestId('label').textContent).toBe('Close');

      rerender(
        <TranslationsProvider locale='fr'>
          <Label translationKey='common.close' />
        </TranslationsProvider>,
      );
      expect(screen.getByTestId('label').textContent).toBe('Fermer');
    });

    it('keeps separate instances isolated from each other', () => {
      const other = createTranslations<Locale, typeof en>({
        dictionaries: { en, fr },
        defaultLocale: 'en',
      });
      const OtherLabel = () => {
        const { t } = other.useTranslations();
        return <span data-testid='other'>{t('common.close')}</span>;
      };

      render(
        <TranslationsProvider locale='fr'>
          <OtherLabel />
        </TranslationsProvider>,
      );

      expect(screen.getByTestId('other').textContent).toBe('common.close');
    });
  });
});
