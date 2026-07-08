// Currency follows the UI language: Tiếng Việt -> VND, 繁體中文 -> TWD.
// All amounts are STORED in VND (the plan is authored in VND); we convert only
// for display/editing using a daily-cached exchange rate (see useFxStore).

export type Currency = 'VND' | 'TWD';

// Fallback when the live rate can't be fetched (offline). ~1 TWD ≈ 800 VND.
// Expressed as TWD per 1 VND so amount_twd = amount_vnd * rate.
export const FALLBACK_TWD_PER_VND = 1 / 800;

export function currencyForLang(lang: string): Currency {
  return lang === 'zh-TW' ? 'TWD' : 'VND';
}

export function vndToDisplay(vnd: number, currency: Currency, twdPerVnd: number): number {
  return currency === 'TWD' ? vnd * twdPerVnd : vnd;
}

export function displayToVnd(value: number, currency: Currency, twdPerVnd: number): number {
  if (currency !== 'TWD') return value;
  return twdPerVnd > 0 ? value / twdPerVnd : value;
}

export function formatMoney(vnd: number, currency: Currency, twdPerVnd: number): string {
  const value = Math.round(vndToDisplay(vnd, currency, twdPerVnd));
  if (currency === 'TWD') {
    return 'NT$' + new Intl.NumberFormat('zh-TW', { maximumFractionDigits: 0 }).format(value);
  }
  return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(value) + ' ₫';
}

export const unitLabel = (currency: Currency): string => (currency === 'TWD' ? 'NT$' : 'VNĐ');
