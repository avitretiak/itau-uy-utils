/// <reference types="@violentmonkey/types" />
import type { ExchangeRatesResponse, ParsedExchangeRates } from '../types/exchange-rates'

const parseRate = (rate: string): number => parseFloat(rate.replace(',', '.'))

const parseXMLResponse = (xmlText: string): ExchangeRatesResponse => {
  const parser = new window.DOMParser()
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml')

  const fecha = xmlDoc.querySelector('fecha')?.textContent ?? ''
  const cotizaciones = Array.from(xmlDoc.querySelectorAll('cotizacion')).map(cotiz => ({
    moneda: cotiz.querySelector('moneda')?.textContent?.trim() ?? '',
    compra: cotiz.querySelector('compra')?.textContent ?? '',
    venta: cotiz.querySelector('venta')?.textContent ?? ''
  }))

  return { fecha, cotizacion: cotizaciones }
}

export const fetchExchangeRates = async (): Promise<ParsedExchangeRates> => {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'GET',
      url: 'https://www.itau.com.uy/inst/aci/cotiz.xml',
      onload: response => {
        try {
          if (!response.responseText) {
            throw new Error('No response text received')
          }

          const data = parseXMLResponse(response.responseText)
          const usdRate = data.cotizacion.find(rate => rate.moneda === 'US.D')

          if (!usdRate) {
            reject(new Error('USD exchange rate not found'))
            return
          }

          resolve({
            usdPurchaseRate: parseRate(usdRate.compra),
            usdSaleRate: parseRate(usdRate.venta)
          })
        } catch (error) {
          console.error('Error parsing exchange rates:', error)
          reject(error)
        }
      },
      onerror: () => {
        const error = new Error('Failed to fetch exchange rates')
        console.error('Error fetching exchange rates:', error)
        reject(error)
      }
    })
  })
}
