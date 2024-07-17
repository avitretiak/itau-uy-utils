# Itaú Utils Userscript

This userscript enhances the Itaú e-banking experience page by adding a varied set of features.
This is a userscript initiated from [@violentmonkey/generator-userscript](https://github.com/violentmonkey/generator-userscript).

## Features

- **Calculate Totals:** Automatically calculates and displays totals in UYU (Uruguayan Pesos) and USD (United States Dollars) based on the transactions listed on the page.
- **Download Transactions:** Allows you to download all transactions shown on the page in JSON format.

## Installation

To use this script, you'll need a userscript manager extension like [Violentmonkey](https://violentmonkey.github.io/) or [Tampermonkey](https://www.tampermonkey.net/) installed in your browser.

1. Install the userscript by clicking [here](https://github.com/avitretiak/itau-uy-utils/releases/latest/download/itau-uy-card-utils.user.js).
2. Visit the Itaú credit card transactions page.

## Usage

- After installing the script, navigate to your Itaú credit card transactions page.
- Click on the "Calcular Totales" button to calculate and display transaction totals.
- Use the "Descargar Transacciones" button to download all transactions in JSON format.

## Development

``` sh
# Compile and watch
$ pnpm run dev

# Build script
$ pnpm run build

# Lint
$ pnpm run lint
```

## Contributions

Contributions are welcome! If you encounter any issues or have suggestions for improvements, please open an issue on [GitHub](https://github.com/avitretiak/itau-uy-utils/issues).

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/avitretiak/itau-uy-utils/blob/main/LICENSE) file for details.
