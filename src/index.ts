import { injectStyles } from './ui/styles'
import { createButtons } from './ui/buttons'

function init(): void {
  injectStyles()

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

init()
