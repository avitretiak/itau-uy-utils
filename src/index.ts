import { injectStyles } from './ui/styles'
import { createButtons } from './ui/buttons'
import { convertBalances } from './services/balance-converter'

function init(): void {
  injectStyles()

  // Check if we're on the accounts page
  const isAccountsPage = window.location.pathname === '/trx/'

  if (isAccountsPage) {
    const observer = new MutationObserver((mutations, obs) => {
      const accountsContainer = document.querySelector<HTMLDivElement>('.zebra-row')
      if (accountsContainer) {
        convertBalances()
        obs.disconnect()
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
  } else {
    // Credit card page functionality
    const observer = new MutationObserver((mutations, obs) => {
      const containerDiv = document.querySelector<HTMLDivElement>(
        'div.contenido.movimientos-actuales'
      )
      if (containerDiv) {
        createButtons()
        obs.disconnect()
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
  }
}

init()
