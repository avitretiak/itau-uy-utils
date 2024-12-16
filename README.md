# Itaú Utils Userscript

Este userscript mejora la experiencia de la banca electrónica de Itaú agregando un conjunto variado
de funcionalidades. Este es un userscript iniciado desde
[@violentmonkey/generator-userscript](https://github.com/violentmonkey/generator-userscript).

## Funcionalidades

- **Conversión de Saldo:** Convierte tu saldo de USD a UYU y viceversa con la tasa de conversión más
  reciente en la página de saldo de cuenta.
- **Calcular Totales:** Calcula y muestra automáticamente los totales en UYU (Pesos Uruguayos) y USD
  (Dólares Estadounidenses) basado en las transacciones listadas en la página, permite excluir
  transacciones, y automáticamente excluye y resalta los pagos del mes anterior.
- **Descargar Transacciones:** Permite descargar todas las transacciones mostradas en la página en
  formato JSON.

## Instalación

Para usar este script, necesitarás una extensión de gestor de userscripts como
[Violentmonkey](https://violentmonkey.github.io/) o [Tampermonkey](https://www.tampermonkey.net/)
instalada en tu navegador.

1. Instala el userscript haciendo clic
   [aquí](https://github.com/avitretiak/itau-uy-utils/releases/latest/download/itau-uy-card-utils.user.js).
2. Visita la página de transacciones de balance de cuenta o movimientos actuales de tú tarjeta de crédito de Itaú.

## Uso

- Después de instalar el script, navega a tu página de transacciones de tarjeta de crédito de Itaú.
- Haz clic en el botón "Calcular Totales" para calcular y mostrar los totales de las transacciones.
- Usa el botón "Descargar Transacciones" para descargar todas las transacciones en formato JSON.

## Desarrollo

```sh
# Compile and watch
$ bun run dev

# Build script
$ bun run build

# Lint
$ bun run lint
```

## Contribuciones

¡Las contribuciones son bienvenidas! Si encuentras algún problema o tienes sugerencias para mejoras,
por favor abre un issue en [GitHub](https://github.com/avitretiak/itau-uy-utils/issues).

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - consulta el archivo
[LICENSE](https://github.com/avitretiak/itau-uy-utils/blob/main/LICENSE) para más detalles.
