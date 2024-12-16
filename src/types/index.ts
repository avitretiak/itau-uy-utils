import cash from 'cash-dom'

export interface Transaction {
  cardNumber: string
  description: string
  type: string
  date: string
  currency: string
  amount: number
  ignored?: boolean
  installments?: {
    current: number
    total: number
  }
}

export interface Totals {
  UYU: number
  USD: number
  [key: string]: number
}

export interface ButtonConfig {
  text: string
  onClick: ($btn: ReturnType<typeof cash>) => void
}
