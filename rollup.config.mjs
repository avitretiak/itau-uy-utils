import { defineExternal, definePlugins } from '@gera2ld/plaid-rollup';
import { defineConfig } from 'rollup';
import userscript from 'rollup-plugin-userscript';
import pkg from './package.json' assert { type: 'json' };

export default defineConfig(
  Object.entries({
    'itau-uy-card-utils': 'src/index.ts'
  }).map(([name, entry]) => ({
    input: entry,
    plugins: [
      ...definePlugins({
        esm: true,
        minimize: false,
        extensions: ['.ts', '.js']
      }),
      userscript(meta =>
        meta.replace('node.author', pkg.author).replace('node.version', pkg.version)
      )
    ],
    external: defineExternal(['@violentmonkey/ui', '@violentmonkey/dom']),
    output: {
      format: 'iife',
      file: `dist/${name}.user.js`,
      globals: {
        '@violentmonkey/dom': 'VM',
        '@violentmonkey/ui': 'VM'
      },
      indent: false
    }
  }))
)
