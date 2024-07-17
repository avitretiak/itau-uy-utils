import './meta.js?userscript-metadata'

interface Transaction {
  cardNumber: string
  description: string
  type: string
  date: string
  currency: string
  amount: number
  installments?: {
    current: number
    total: number
  }
}

interface Totals {
  UYU: number
  USD: number
}

function calculateTotals(transactions: Transaction[]): Totals {
  return {
    UYU: transactions.filter(t => t.currency === 'UYU').reduce((sum, t) => sum + t.amount, 0),
    USD: transactions.filter(t => t.currency === 'USD').reduce((sum, t) => sum + t.amount, 0)
  }
}
function formatAmount(amount: number, currency: string): string {
  const prefix = amount < 0 ? 'Saldo a Favor: ' : 'Saldo a Pagar: '
  const color = amount < 0 ? '#28a745' : '#dc3545'
  const formattedAmount = Math.abs(amount)
    .toFixed(2)
    .replace(/\d(?=(\d{3})+\.)/g, '$&,')
  return `<span style="color: ${color};">${prefix}${currency} ${formattedAmount}</span>`
}

function addTotalsRow(): void {
  const table = document.getElementById('tbl_movimientos_actuales')
  if (!table) {
    console.log('Tabla no encontrada')
    return
  }

  const transactions = parseTransactionTable()
  if (!transactions) {
    console.log('No se encontraron datos de transacciones')
    return
  }

  const totals = calculateTotals(transactions)

  // Remove existing totals and separator rows if they exist
  const existingTotalsRow = document.getElementById('totalsRow')
  const existingSeparatorRow = document.getElementById('separatorRow')
  if (existingTotalsRow) existingTotalsRow.remove()
  if (existingSeparatorRow) existingSeparatorRow.remove()

  // Create a separator row
  const separatorRow = (table as HTMLTableElement).insertRow(-1)
  separatorRow.id = 'separatorRow'
  const separatorCell = separatorRow.insertCell(0)
  separatorCell.colSpan = 7
  separatorCell.style.height = '10px'
  separatorCell.style.backgroundColor = 'white'

  // Create a new row for totals
  const newRow = (table as HTMLTableElement).insertRow(-1)
  newRow.id = 'totalsRow'
  newRow.className = (table as HTMLTableElement).rows[1].className

  const cell = newRow.insertCell(0)

  // Set the content for the new cells
  cell.innerHTML = `
            ${formatAmount(totals.UYU, 'UYU')}<br>
            ${formatAmount(totals.USD, 'USD')}
        `
  cell.colSpan = 12

  // Apply existing styles
  cell.className = (table as HTMLTableElement).rows[1].cells[0].className
  cell.className = (table as HTMLTableElement).rows[1].cells[4].className

  // Minimal custom styling
  newRow.style.fontWeight = 'bold'
  cell.style.textAlign = 'center'
}

function parseTransactionTable(): Transaction[] | null {
  const table = document.getElementById('tbl_movimientos_actuales') as HTMLTableElement | null
  if (!table) return null

  const rows = Array.from(table.rows)
  const transactions: Transaction[] = []

  for (let i = 0; i < rows.length; i++) {
    const cells = Array.from(rows[i].cells)
    if (cells.length >= 6) {
      const cardNumber = cells[0].textContent?.trim().replace('**** ', '') || ''
      const description = cells[1].textContent?.trim() || ''
      const type = cells[2].textContent?.trim() || ''
      const date =
        cells[3].textContent
          ?.trim()
          .split('/')
          .reverse()
          .map((part, index) => (index === 0 ? `20${part}` : part))
          .join('-') || ''
      const currency = cells[4].textContent?.trim() || ''
      const amount = cells[5].textContent?.trim() || ''
      const installmentsText = cells[6]?.textContent?.trim() || ''

      // Convert amount to number
      const numAmount = parseFloat(amount.replace(/\./g, '').replace(',', '.'))

      // Determine currency code
      const currencyCode = currency === 'Pesos' ? 'UYU' : 'USD'

      const transaction: Transaction = {
        cardNumber,
        description,
        type,
        date,
        currency: currencyCode,
        amount: numAmount
      }

      if (installmentsText) {
        const [currentInstallment, totalInstallments] = installmentsText
          .split('/')
          .map(part => parseInt(part, 10) || 0)
        transaction.installments = {
          current: currentInstallment,
          total: totalInstallments
        }
      }

      transactions.push(transaction)
    }
  }

  return transactions
}
function createButtons(): void {
  // Create a flex container
  const flexContainer = document.createElement('div')
  flexContainer.style.display = 'flex'
  flexContainer.style.justifyContent = 'center'
  flexContainer.style.gap = '10px' // Add some space between buttons
  flexContainer.style.marginTop = '15px'
  flexContainer.style.marginBottom = '15px'

  // Create the calculate button
  const calculateButton = document.createElement('button')
  calculateButton.textContent = 'Calcular Totales'
  calculateButton.className = 'c-button'
  calculateButton.type = 'button'
  calculateButton.addEventListener('click', addTotalsRow)

  // Create the download button
  const downloadButton = document.createElement('button')
  downloadButton.textContent = 'Descargar Transacciones'
  downloadButton.className = 'c-button'
  downloadButton.type = 'button'
  downloadButton.addEventListener('click', () => {
    const transactions = parseTransactionTable()
    if (transactions) {
      downloadTransactions(transactions)
    } else {
      console.log('No se encontraron datos de transacciones para descargar')
    }
  })

  // Add the buttons to the flex container
  flexContainer.appendChild(calculateButton)
  flexContainer.appendChild(downloadButton)

  // Find the container div
  const containerDiv = document.querySelector<HTMLDivElement>('div.contenido.movimientos-actuales')

  if (containerDiv) {
    // Find the first table inside the container div
    const firstTable = containerDiv.querySelector('table')

    if (firstTable) {
      // Insert the flex container after the first table
      firstTable.parentNode?.insertBefore(flexContainer, firstTable.nextSibling)
    } else {
      // If no table is found, append to the container div
      containerDiv.appendChild(flexContainer)
    }
  } else {
    // Fallback: Append to body if the specific div is not found
    document.body.appendChild(flexContainer)
  }
}
function init(): void {
  const observer = new MutationObserver((mutations, obs) => {
    const containerDiv = document.querySelector<HTMLDivElement>(
      'div.contenido.movimientos-actuales'
    )
    if (containerDiv) {
      createButtons()
      obs.disconnect() // Stop observing once we've added the buttons
    }
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true
  })
}
function downloadTransactions(transactions: Transaction[]): void {
  // Create JSON content
  const jsonContent = JSON.stringify(transactions, null, 2) // Pretty-print with 2 spaces

  // Create a Blob with the JSON content
  const blob = new Blob([jsonContent], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0]

  // Create a temporary link element and trigger the download
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `transactions_${today}.json`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  // Clean up the URL object
  URL.revokeObjectURL(url)
}
// Run the init function when the script loads
init()
