import { createContext, useContext, useState } from 'react';

const CurrencyContext = createContext();

export const CURRENCIES = {
  INR: { code: 'INR', symbol: '₹', rate: 1, name: 'Indian Rupee', locale: 'en-IN' },
  USD: { code: 'USD', symbol: '$', rate: 0.012, name: 'US Dollar', locale: 'en-US' },
  EUR: { code: 'EUR', symbol: '€', rate: 0.011, name: 'Euro', locale: 'de-DE' },
  GBP: { code: 'GBP', symbol: '£', rate: 0.0093, name: 'British Pound', locale: 'en-GB' },
  AED: { code: 'AED', symbol: 'AED ', rate: 0.044, name: 'UAE Dirham', locale: 'ar-AE' },
  JPY: { code: 'JPY', symbol: '¥', rate: 1.86, name: 'Japanese Yen', locale: 'ja-JP' },
  CAD: { code: 'CAD', symbol: 'CA$', rate: 0.016, name: 'Canadian Dollar', locale: 'en-CA' }
};

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState('INR');

  const formatMoney = (amountInINR = 0) => {
    const curr = CURRENCIES[currency] || CURRENCIES.INR;
    const converted = Number(amountInINR) * curr.rate;
    return new Intl.NumberFormat(curr.locale, {
      style: 'currency',
      currency: curr.code,
      maximumFractionDigits: curr.code === 'JPY' ? 0 : 2
    }).format(converted);
  };

  const convertFromINR = (amountInINR = 0) => {
    const curr = CURRENCIES[currency] || CURRENCIES.INR;
    return Number(amountInINR) * curr.rate;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        currentCurrency: CURRENCIES[currency] || CURRENCIES.INR,
        formatMoney,
        convertFromINR,
        currencies: CURRENCIES
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
