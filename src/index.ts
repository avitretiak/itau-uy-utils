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
  ignored?: boolean
}

interface Totals {
  UYU: number
  USD: number
}

function calculateTotals(transactions: Transaction[]): Totals {
  const activeTransactions = transactions.filter(t => !t.ignored)
  return {
    UYU: activeTransactions.filter(t => t.currency === 'UYU').reduce((sum, t) => sum + t.amount, 0),
    USD: activeTransactions.filter(t => t.currency === 'USD').reduce((sum, t) => sum + t.amount, 0)
  }
}

function parseTransactionTable(): Transaction[] | null {
  const table = document.getElementById('tbl_movimientos_actuales') as HTMLTableElement | null
  if (!table) return null

  const rows = Array.from(table.rows)
  const transactions: Transaction[] = []

  // Skip header row
  for (let i = 1; i < rows.length; i++) {
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

      const numAmount = parseFloat(amount.replace(/\./g, '').replace(',', '.'))
      const currencyCode = currency === 'Pesos' ? 'UYU' : 'USD'

      const transaction: Transaction = {
        cardNumber,
        description,
        type,
        date,
        currency: currencyCode,
        amount: numAmount,
        ignored: false
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

function addCheckboxesToTable(): void {
  const table = document.getElementById('tbl_movimientos_actuales') as HTMLTableElement | null
  if (!table) return

  // Add header for checkbox column
  const headerRow = table.rows[0]
  const checkboxHeader = document.createElement('th')
  checkboxHeader.textContent = 'Ignorar'
  checkboxHeader.className = headerRow.cells[0].className
  headerRow.insertBefore(checkboxHeader, headerRow.firstChild)

  // Add checkboxes to each row
  for (let i = 1; i < table.rows.length; i++) {
    const row = table.rows[i]
    const checkboxCell = row.insertCell(0)
    checkboxCell.className = row.cells[1].className
    
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.style.cursor = 'pointer'
    checkbox.addEventListener('change', () => {
      const transactions = parseTransactionTable()
      if (transactions) {
        transactions[i - 1].ignored = checkbox.checked
        addTotalsRow()
      }
    })
    
    checkboxCell.appendChild(checkbox)
  }
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

  // Update ignored status based on checkboxes
  const checkboxes = Array.from(table.querySelectorAll('input[type="checkbox"]'))
  checkboxes.forEach((checkbox, index) => {
    if (transactions[index]) {
      transactions[index].ignored = (checkbox as HTMLInputElement).checked
    }
  })

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
  separatorCell.colSpan = 8 // Updated colspan to account for new checkbox column
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
  cell.colSpan = 13 // Updated colspan to account for new checkbox column

  // Apply existing styles
  cell.className = (table as HTMLTableElement).rows[1].cells[0].className
  cell.className = (table as HTMLTableElement).rows[1].cells[4].className

  // Minimal custom styling
  newRow.style.fontWeight = 'bold'
  cell.style.textAlign = 'center'
}

function createButtons(): void {
  // Create a flex container
  const flexContainer = document.createElement('div')
  flexContainer.style.display = 'flex'
  flexContainer.style.justifyContent = 'center'
  flexContainer.style.gap = '10px'
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
      // Append to the container div
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
      addCheckboxesToTable() // Add checkboxes when the table is ready
      createButtons()
      obs.disconnect() // Stop observing once we've added the elements
    }
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true
  })
}

// Run the init function when the script loads
init()
