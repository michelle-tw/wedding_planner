import { useTranslation } from 'react-i18next';
import { useFxStore } from '../store/useFxStore';
import {
  currencyForLang,
  vndToDisplay,
  displayToVnd,
  formatMoney,
  unitLabel,
  type Currency,
} from './currency';

// Money helpers bound to the active language + live rate. Amounts are stored in
// VND; `toDisplay`/`fromDisplay` convert to/from the currency shown to the user.
export function useCurrency() {
  const { i18n } = useTranslation();
  const twdPerVnd = useFxStore((s) => s.twdPerVnd);
  const currency: Currency = currencyForLang(i18n.language);

  return {
    currency,
    twdPerVnd,
    unit: unitLabel(currency),
    format: (vnd: number) => formatMoney(vnd, currency, twdPerVnd),
    toDisplay: (vnd: number) => Math.round(vndToDisplay(vnd, currency, twdPerVnd)),
    fromDisplay: (value: number) => Math.round(displayToVnd(value, currency, twdPerVnd)),
    // step for number inputs, sized to the currency's magnitude
    step: currency === 'TWD' ? 1000 : 1_000_000,
  };
}
