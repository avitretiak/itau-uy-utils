import cash from 'cash-dom'
import { Transaction } from '../types'
import { calculateTotals, formatAmount } from '../utils/calculations'

const $ = cash

export function parseTransactionTable(): Transaction[] | null {
  const $rows = $('#tbl_movimientos_actuales tr').not('#totalsRow, #separatorRow, #reminderRow')
  if (!$rows.length) return null

  const transactions: Transaction[] = []

  $rows.each((_, row: HTMLElement) => {
    const $cells = $(row).find('td')
    if ($cells.length >= 6) {
      const $checkbox = $(row).find('.ignore-checkbox')
      const [currentInstallment, totalInstallments] = $cells
        .eq(6)
        .text()
        .trim()
        .split('/')
        .map(part => parseInt(part, 10) || 0)

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
          .map((part, i) => (i === 0 ? `20${part}` : part))
          .join('-'),
        currency: $cells.eq(4).text().trim() === 'Pesos' ? 'UYU' : 'USD',
        amount: parseFloat($cells.eq(5).text().trim().replace(/\./g, '').replace(',', '.')),
        ignored: $checkbox.length ? !$checkbox.prop('checked') : false
      }

      if (currentInstallment && totalInstallments) {
        transaction.installments = { current: currentInstallment, total: totalInstallments }
      }

      transactions.push(transaction)
    }
  })

  return transactions
}

export function addTotalsRow(): void {
  const $table = $('#tbl_movimientos_actuales')
  if (!$table.length) {
    console.log('Tabla no encontrada')
    return
  }

  const transactions = parseTransactionTable()
  if (!transactions) {
    console.log('No se encontraron datos de transacciones')
    return
  }

  const totals = calculateTotals(transactions)

  // Remove existing special rows
  $('#totalsRow, #separatorRow, #reminderRow').remove()

  // Add special rows
  $table.append(`
    <tr id="reminderRow">
      <td colspan="12" style="text-align: center; padding: 5px;">
        <span style="color: #6c757d; font-style: italic;">
          Recuerda desmarcar los pagos del mes anterior (uno en pesos y otro en dólares)
        </span>
      </td>
    </tr>
    <tr id="separatorRow">
      <td colspan="7" style="height: 10px; background-color: white;"></td>
    </tr>
    <tr id="totalsRow">
      <td colspan="12" style="text-align: center; font-weight: bold;">
        ${formatAmount(totals.UYU, 'UYU')}<br>
        ${formatAmount(totals.USD, 'USD')}
      </td>
    </tr>
  `)
}
