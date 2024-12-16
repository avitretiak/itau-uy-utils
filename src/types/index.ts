import { Cash } from 'cash-dom'
import type { SupportedCurrency } from '../config/currency'

export interface Transaction {
  cardNumber: string
  description: string
  type: string
  date: string
  currency: SupportedCurrency
  amount: number
  ignored?: boolean
  installments?: {
    current: number
    total: number
  }
}

export type Totals = Record<SupportedCurrency, number>

export interface ButtonConfig {
  text: string
  onClick: ($btn: Cash) => void
}

export interface TableCell {
  text: string
  className?: string
  style?: Partial<CSSStyleDeclaration & { [key: string]: string | number }>
}
