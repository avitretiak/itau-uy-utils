import $, { Cash } from 'cash-dom'
import type { Transaction, Totals } from '../types'
import { currencyConfig, SupportedCurrency } from '../config/currency'
import { formatCurrency } from '../utils/currency'

const TRANSACTION_TABLE_ID = 'tbl_movimientos_actuales'
const SPECIAL_ROW_IDS = ['totalsRow', 'separatorRow', 'reminderRow']

const parseTransactionRow = ($cells: Cash): Transaction | null => {
  if ($cells.length < 6) return null

  const [currentInstallment, totalInstallments] = $cells
    .eq(6)
    .text()
    .trim()
    .split('/')
    .map((part: string): number => parseInt(part, 10) || 0)

  const currency =
    $cells.eq(4).text().trim() === 'Pesos'
      ? currencyConfig.currencies.uyu
      : currencyConfig.currencies.usd

  const transaction: Transaction = {
    cardNumber: $cells.eq(0).text().trim().replace('**** ', ''),
    description: $cells.eq(1).text().trim(),
    type: $cells.eq(2).text().trim(),
    date: $cells
      .eq(3)
      .text()
      .trim()
      .split('/')
      .reverse()
      .map((part: string, i: number): string => (i === 0 ? `20${part}` : part))
      .join('-'),
    currency,
    amount: parseFloat($cells.eq(5).text().trim().replace(/\./g, '').replace(',', '.')),
    ignored: !$cells.parent().find('.ignore-checkbox').prop('checked')
  }

  if (currentInstallment && totalInstallments) {
    transaction.installments = { current: currentInstallment, total: totalInstallments }
  }

  return transaction
}

export function parseTransactionTable(): Transaction[] | null {
  const $rows = $(`#${TRANSACTION_TABLE_ID} tr`).not(SPECIAL_ROW_IDS.map(id => `#${id}`).join(', '))

  if (!$rows.length) return null

  const transactions: Transaction[] = []

  $rows.each((_, row) => {
    const $cells = $(row).find('td')
    const transaction = parseTransactionRow($cells)
    if (transaction) {
      transactions.push(transaction)
    }
  })

  return transactions
}

export function calculateTotals(transactions: Transaction[]): Totals {
  const totals: Totals = {
    [currencyConfig.currencies.uyu]: 0,
    [currencyConfig.currencies.usd]: 0
  }

  transactions
    .filter(t => !t.ignored)
    .forEach(({ currency, amount }) => {
      totals[currency] += amount
    })

  return totals
}

const formatTotalAmount = (amount: number, currency: string): string => {
  const isCredit = amount < 0
  const formattedAmount = formatCurrency(Math.abs(amount), currency as SupportedCurrency)
  const { colors } = currencyConfig.styles

  return `<span style="color: ${isCredit ? colors.credit : colors.debit};">
    Saldo en <b>${currency}</b>: ${formattedAmount} ${isCredit ? 'a Favor.' : 'a Pagar.'}
  </span>`
}

export function addTotalsRow(): void {
  const $table = $(`#${TRANSACTION_TABLE_ID}`)
  if (!$table.length) {
    console.log('Table not found')
    return
  }

  const transactions = parseTransactionTable()
  if (!transactions) {
    console.log('No transaction data found')
    return
  }

  const totals = calculateTotals(transactions)
  const { colors } = currencyConfig.styles

  // Remove existing special rows
  SPECIAL_ROW_IDS.forEach(id => $(`#${id}`).remove())

  // Add special rows
  $table.append(`
    <tr id="reminderRow">
      <td colspan="12" style="text-align: center; padding: 5px;">
        <span style="color: ${colors.secondary}; font-style: italic;">
          Recuerda desmarcar los pagos del mes anterior (uno en pesos y otro en dólares)
        </span>
      </td>
    </tr>
    <tr id="separatorRow">
      <td colspan="7" style="height: 10px; background-color: white;"></td>
    </tr>
    <tr id="totalsRow">
      <td colspan="12" style="text-align: center; font-weight: bold;">
        ${formatTotalAmount(totals[currencyConfig.currencies.uyu], currencyConfig.currencies.uyu)}<br>
        ${formatTotalAmount(totals[currencyConfig.currencies.usd], currencyConfig.currencies.usd)}
      </td>
    </tr>
  `)
}
