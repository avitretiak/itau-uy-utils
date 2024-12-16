export interface ExchangeRate {
  moneda: string
  compra: string
  venta: string
}

export interface ExchangeRatesResponse {
  fecha: string
  cotizacion: ExchangeRate[]
}

export interface ParsedExchangeRates {
  usdPurchaseRate: number
  usdSaleRate: number
}
