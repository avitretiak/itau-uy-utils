import cash from 'cash-dom'
import { addTotalsRow } from '../services/transactions'

const $ = cash

export function setupTableModifications(): void {
  const $table = $('.table-movimientos-actuales-2')
  if (!$table.length) return

  // Add checkbox header if needed
  const $thead = $table.find('thead tr').first()
  if ($thead.length) {
    let hasIncluirHeader = false
    $thead.find('th').each((_, th: HTMLElement) => {
      if ($(th).text().trim() === 'Incluir') {
        hasIncluirHeader = true
      }
    })
    if (!hasIncluirHeader) {
      $thead.append('<th class="bgcolor-head checkbox-cell">Incluir</th>')
    }
  }

  // Process tbody rows
  const $tbody = $('#tbl_movimientos_actuales')
  if (!$tbody.length) return

  // First find payment receipt rows
  const paymentReceiptRows: HTMLElement[] = []
  $tbody
    .find('tr')
    .not('#totalsRow, #separatorRow, #reminderRow')
    .each((_, row: HTMLElement) => {
      const $row = $(row)
      const $descCell = $row.find('td').eq(1)
      if ($descCell.text().trim() === 'RECIBO DE PAGO') {
        paymentReceiptRows.push(row)
      }
    })

  // Then process all rows
  $tbody
    .find('tr')
    .not('#totalsRow, #separatorRow, #reminderRow')
    .each((_, row: HTMLElement) => {
      const $row = $(row)
      const $descCell = $row.find('td').eq(1)
      const isPaymentReceipt = $descCell.text().trim() === 'RECIBO DE PAGO'
      const paymentReceiptIndex = paymentReceiptRows.indexOf(row)

      // Add payment receipt styling
      if (isPaymentReceipt) {
        $row.find('td').addClass('payment-receipt')
      }

      // Add checkbox if needed
      if (!$row.find('.ignore-checkbox').length) {
        const $checkboxCell = $('<td>').addClass('checkbox-cell')
        const $checkbox = $('<input>')
          .attr('type', 'checkbox')
          .addClass('ignore-checkbox')
          .prop('checked', !isPaymentReceipt || paymentReceiptIndex >= 2)
          .on('change', addTotalsRow)

        $checkboxCell.append($checkbox)
        $row.append($checkboxCell)
      }
    })

  // Calculate initial totals
  addTotalsRow()
}
