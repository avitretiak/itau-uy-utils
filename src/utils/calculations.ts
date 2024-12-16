import { Transaction, Totals } from '../types'

export function calculateTotals(transactions: Transaction[]): Totals {
  return transactions
    .filter(t => !t.ignored)
    .reduce(
      (totals: Totals, t) => {
        if (t.currency in totals) {
          totals[t.currency] += t.amount
        }
        return totals
      },
      { UYU: 0, USD: 0 }
    )
}

export function formatAmount(amount: number, currency: string): string {
  const isCredit = amount < 0
  const formattedAmount = Math.abs(amount)
    .toFixed(2)
    .replace(/\d(?=(\d{3})+\.)/g, '$&,')

  return `<span style="color: ${isCredit ? '#28a745' : '#dc3545'};">
    Saldo en <b>${currency}</b>: ${formattedAmount} ${isCredit ? 'a Favor.' : 'a Pagar.'}
  </span>`
}

export function downloadTransactions(transactions: Transaction[]): void {
  const blob = new Blob([JSON.stringify(transactions, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const today = new Date().toISOString().split('T')[0]

  const $link = document.createElement('a')
  $link.href = url
  $link.download = `transactions_${today}.json`
  document.body.appendChild($link)
  $link.click()
  document.body.removeChild($link)
  URL.revokeObjectURL(url)
}
