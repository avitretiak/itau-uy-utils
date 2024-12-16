import cash from 'cash-dom'
import { ButtonConfig } from '../types'
import { setupTableModifications } from './table'
import { parseTransactionTable } from '../services/transactions'
import { downloadTransactions } from '../utils/calculations'

const $ = cash

export function createButtons(): void {
  const $container = $('<div>').css({
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '15px',
    marginBottom: '15px'
  })

  const buttons: ButtonConfig[] = [
    {
      text: 'Parsear Tabla',
      onClick: ($btn: ReturnType<typeof $>) => {
        setupTableModifications()
        $btn.prop('disabled', true).text('Tabla Parseada')
      }
    },
    {
      text: 'Descargar Transacciones',
      onClick: () => {
        const transactions = parseTransactionTable()
        if (transactions) {
          downloadTransactions(transactions)
        } else {
          console.log('No se encontraron datos de transacciones para descargar')
        }
      }
    }
  ]

  buttons.forEach(({ text, onClick }) => {
    const $button = $('<button>')
      .addClass('c-button')
      .attr('type', 'button')
      .text(text)
      .on('click', function (this: HTMLElement) {
        onClick($(this))
      })
    $container.append($button)
  })

  const $target = $('.contenido.movimientos-actuales table').first()
  if ($target.length) {
    $container.insertAfter($target)
  } else {
    $('.contenido.movimientos-actuales').append($container)
  }
}
