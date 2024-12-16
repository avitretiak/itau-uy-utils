import $ from 'cash-dom'
import { fetchExchangeRates } from './exchange-rates'

const config = {
  usdAccountSelector: '.zebra-row:nth-child(1)',
  uyuAccountSelector: '.zebra-row:nth-child(2)',
  locale: 'es-AR',
  usdCurrency: 'USD',
  uyuCurrency: 'UYU'
}

const formatCurrency = (amount: number, currency: string): string => {
  return amount.toLocaleString(config.locale, { style: 'currency', currency })
}

const convertBalance = (
  balance: number,
  rate: number,
  fromCurrency: string,
  toCurrency: string
): string => {
  const convertedBalance = (
    fromCurrency === config.usdCurrency ? balance * rate : balance / rate
  ).toFixed(2)
  return formatCurrency(parseFloat(convertedBalance), toCurrency)
}

const displayConvertedBalance = (
  accountSelector: string,
  balance: string,
  convertedBalance: string
): void => {
  const balanceElement = $(`${accountSelector} .saldo-valor`)
  if (!balanceElement.length) return

  balanceElement.text(balance)
  const convertedBalanceElement = $('<p>')
    .text(convertedBalance)
    .addClass('saldo-valor')
    .css('color', 'gray')

  balanceElement.parent().append(convertedBalanceElement)
}

const parseBalance = (balanceText: string): number => {
  return parseFloat(
    balanceText
      .replace(/,/g, '.')
      .replace(/\.(?=.*\.)/g, '')
      .replace(/\$/g, '') || '0'
  )
}

export const convertBalances = async (): Promise<void> => {
  try {
    const { usdPurchaseRate, usdSaleRate } = await fetchExchangeRates()

    const usdBalanceElement = $(`${config.usdAccountSelector} .saldo-valor`)
    const uyuBalanceElement = $(`${config.uyuAccountSelector} .saldo-valor`)

    if (!usdBalanceElement.length || !uyuBalanceElement.length) {
      throw new Error('Balance elements not found')
    }

    const usdBalance = parseBalance(usdBalanceElement.text())
    const uyuBalance = parseBalance(uyuBalanceElement.text())

    const convertedUsdBalance = convertBalance(
      usdBalance,
      usdPurchaseRate,
      config.usdCurrency,
      config.uyuCurrency
    )
    const convertedUyuBalance = convertBalance(
      uyuBalance,
      usdSaleRate,
      config.uyuCurrency,
      config.usdCurrency
    )

    displayConvertedBalance(
      config.usdAccountSelector,
      formatCurrency(usdBalance, config.usdCurrency),
      convertedUsdBalance
    )
    displayConvertedBalance(
      config.uyuAccountSelector,
      formatCurrency(uyuBalance, config.uyuCurrency),
      convertedUyuBalance
    )
  } catch (error) {
    console.error('Error converting balances:', error)
  }
}
