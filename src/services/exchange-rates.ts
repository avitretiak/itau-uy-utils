/// <reference types="@violentmonkey/types" />
import type { ExchangeRatesResponse, ParsedExchangeRates } from '../types/exchange-rates'

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
let cachedRates: { data: ParsedExchangeRates; timestamp: number } | null = null

const parseRate = (rate: string): number => parseFloat(rate.replace(',', '.'))

const parseXMLResponse = (xmlText: string): ExchangeRatesResponse => {
  const parser = new window.DOMParser()
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml')

  if (xmlDoc.querySelector('parsererror')) {
    throw new Error('Invalid XML response')
  }

  const fecha = xmlDoc.querySelector('fecha')?.textContent
  if (!fecha) {
    throw new Error('Missing date in response')
  }

  const cotizaciones = Array.from(xmlDoc.querySelectorAll('cotizacion')).map(cotiz => {
    const moneda = cotiz.querySelector('moneda')?.textContent?.trim()
    const compra = cotiz.querySelector('compra')?.textContent
    const venta = cotiz.querySelector('venta')?.textContent

    if (!moneda || !compra || !venta) {
      throw new Error('Invalid rate data structure')
    }

    return { moneda, compra, venta }
  })

  return { fecha, cotizacion: cotizaciones }
}

const makeRequest = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'GET',
      url: 'https://www.itau.com.uy/inst/aci/cotiz.xml',
      onload: response => {
        if (!response.responseText) {
          reject(new Error('No response text received'))
          return
        }
        resolve(response.responseText)
      },
      onerror: () => reject(new Error('Failed to fetch exchange rates'))
    })
  })
}

export const fetchExchangeRates = async (): Promise<ParsedExchangeRates> => {
  try {
    // Return cached rates if still valid
    if (cachedRates && Date.now() - cachedRates.timestamp < CACHE_DURATION) {
      return cachedRates.data
    }

    const xmlText = await makeRequest()
    const data = parseXMLResponse(xmlText)
    const usdRate = data.cotizacion.find(rate => rate.moneda === 'US.D')

    if (!usdRate) {
      throw new Error('USD exchange rate not found')
    }

    const rates = {
      usdPurchaseRate: parseRate(usdRate.compra),
      usdSaleRate: parseRate(usdRate.venta)
    }

    // Cache the new rates
    cachedRates = {
      data: rates,
      timestamp: Date.now()
    }

    return rates
  } catch (error) {
    console.error('Error fetching exchange rates:', error)
    throw error
  }
}
