import $, { Cash } from 'cash-dom'

import { currencyConfig } from '../config/currency'
import { fetchExchangeRates } from './exchange-rates'
import { convertCurrency, formatCurrency, parseBalance } from '../utils/currency'

interface BalanceDisplay {
  element: Cash
  originalBalance: number
  formattedBalance: string
  convertedBalance: string
}

const findBalanceElement = (selector: string): Cash => {
  const element = $(`${selector} ${currencyConfig.selectors.balanceValue}`)
  if (!element.length) {
    throw new Error(`Balance element not found for selector: ${selector}`)
  }
  return element
}

const displayConvertedBalance = ({
  element,
  formattedBalance,
  convertedBalance
}: BalanceDisplay): void => {
  element
    .text(formattedBalance)
    .parent()
    .append($('<p>').text(convertedBalance).addClass('saldo-valor').css('color', 'gray'))
}

const getBalanceDisplay = (
  selector: string,
  balance: number,
  convertedBalance: string,
  currency: keyof typeof currencyConfig.currencies
): BalanceDisplay => ({
  element: findBalanceElement(selector),
  originalBalance: balance,
  formattedBalance: formatCurrency(balance, currencyConfig.currencies[currency]),
  convertedBalance
})

export const convertBalances = async (): Promise<void> => {
  try {
    const { usdPurchaseRate, usdSaleRate } = await fetchExchangeRates()

    // Find and validate balance elements
    const usdElement = findBalanceElement(currencyConfig.selectors.usdAccount)
    const uyuElement = findBalanceElement(currencyConfig.selectors.uyuAccount)

    // Parse balances
    const usdBalance = parseBalance(usdElement.text())
    const uyuBalance = parseBalance(uyuElement.text())

    // Convert balances
    const convertedUsdBalance = convertCurrency(
      usdBalance,
      usdPurchaseRate,
      currencyConfig.currencies.usd,
      currencyConfig.currencies.uyu
    )
    const convertedUyuBalance = convertCurrency(
      uyuBalance,
      usdSaleRate,
      currencyConfig.currencies.uyu,
      currencyConfig.currencies.usd
    )

    // Prepare balance displays
    const usdDisplay = getBalanceDisplay(
      currencyConfig.selectors.usdAccount,
      usdBalance,
      convertedUsdBalance,
      'usd'
    )
    const uyuDisplay = getBalanceDisplay(
      currencyConfig.selectors.uyuAccount,
      uyuBalance,
      convertedUyuBalance,
      'uyu'
    )

    // Update DOM
    displayConvertedBalance(usdDisplay)
    displayConvertedBalance(uyuDisplay)
  } catch (error) {
    console.error('Error converting balances:', error)
    // Optionally show user-friendly error message in the UI
    $(`${currencyConfig.selectors.usdAccount}, ${currencyConfig.selectors.uyuAccount}`)
      .find(currencyConfig.selectors.balanceValue)
      .after($('<p>').text('Error al convertir saldos').css({ color: 'red', fontSize: '0.8em' }))
  }
}
