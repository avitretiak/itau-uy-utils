export const currencyConfig = {
  selectors: {
    usdAccount: '.zebra-row:nth-child(1)',
    uyuAccount: '.zebra-row:nth-child(2)',
    balanceValue: '.saldo-valor'
  },
  formatting: {
    locale: 'es-AR'
  },
  currencies: {
    usd: 'USD',
    uyu: 'UYU'
  },
  styles: {
    colors: {
      credit: '#28a745', // Green for credit/favor
      debit: '#dc3545', // Red for debit/pagar
      secondary: '#6c757d', // Gray for secondary text
      converted: 'gray' // For converted balance display
    },
    fontSize: {
      small: '0.8em'
    }
  }
} as const

export type SupportedCurrency =
  (typeof currencyConfig.currencies)[keyof typeof currencyConfig.currencies]
