import $ from 'cash-dom'
import type { Transaction } from '../types'
import type { SupportedCurrency } from '../config/currency'
import { formatCurrency } from './currency'

export function formatAmount(amount: number, currency: SupportedCurrency): string {
  const isCredit = amount < 0
  const formattedAmount = formatCurrency(Math.abs(amount), currency)

  return `<span style="color: ${isCredit ? '#28a745' : '#dc3545'};">
    Saldo en <b>${currency}</b>: ${formattedAmount} ${isCredit ? 'a Favor.' : 'a Pagar.'}
  </span>`
}

export function downloadTransactions(transactions: Transaction[]): void {
  const blob = new Blob([JSON.stringify(transactions, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const today = new Date().toISOString().split('T')[0]
  const filename = `transactions_${today}.json`

  // Create and append link element
  const $link = $('<a>')
    .attr({
      href: url,
      download: filename
    })
    .appendTo('body')

  // Get the native element and ensure it exists before clicking
  const linkElement = $link[0]
  if (linkElement) {
    linkElement.click()
    $link.remove()
    URL.revokeObjectURL(url)
  } else {
    console.error('Failed to create download link element')
    URL.revokeObjectURL(url)
  }
}
