import cash from 'cash-dom'
const $ = cash

export function injectStyles(): void {
  const styles = `
    .modal-dialog-centered {
      max-width: 95% !important;
      width: 95% !important;
      margin: 20px auto !important;
    }

    .modal-content {
      max-height: 90vh !important;
      height: 90vh !important;
      overflow-y: auto !important;
    }

    .table-movimientos-actuales-2 {
      width: 100% !important;
      border-collapse: collapse !important;
      margin-bottom: 20px !important;
    }

    .table-movimientos-actuales-2 td,
    .table-movimientos-actuales-2 th {
      padding: 8px 12px !important;
      border-bottom: 1px solid #dee2e6 !important;
    }

    .table-movimientos-actuales-2 .payment-receipt {
      font-weight: bold !important;
      background-color: #fff3cd !important;
    }

    .table-movimientos-actuales-2 .checkbox-cell {
      text-align: center !important;
      width: 80px !important;
    }

    .table-movimientos-actuales-2 .ignore-checkbox {
      margin: 0 !important;
      width: 20px !important;
      height: 20px !important;
    }

    .table-movimientos-actuales-2 th.checkbox-cell {
      background-color: #f8f9fa !important;
      font-weight: bold !important;
    }
  `

  $('<style>').html(styles).appendTo('head')
}
