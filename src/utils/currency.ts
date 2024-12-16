import { currencyConfig, type SupportedCurrency } from '../config/currency'

export const formatCurrency = (amount: number, currency: SupportedCurrency): string => {
  return amount.toLocaleString(currencyConfig.formatting.locale, {
    style: 'currency',
    currency
  })
}

export const parseBalance = (balanceText: string): number => {
  return parseFloat(
    balanceText
      .replace(/,/g, '.')
      .replace(/\.(?=.*\.)/g, '') // Remove all dots except the last one
      .replace(/\$/g, '')
      .trim() || '0'
  )
}

export const convertCurrency = (
  balance: number,
  rate: number,
  fromCurrency: SupportedCurrency,
  toCurrency: SupportedCurrency
): string => {
  const convertedBalance = (
    fromCurrency === currencyConfig.currencies.usd ? balance * rate : balance / rate
  ).toFixed(2)

  return formatCurrency(parseFloat(convertedBalance), toCurrency)
}
