import { readFileSync } from 'fs'
import { join } from 'path'

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'))

// Read and process meta.js template
const metaTemplate = readFileSync('./src/meta.js', 'utf-8')
  .replace('node.author', pkg.author)
  .replace('node.version', pkg.version)
  .replace('node.description', pkg.description)
  .replace('node.license', pkg.license)

// Build the main script
const result = await Bun.build({
  entrypoints: ['./src/index.ts'],
  outdir: './dist',
  naming: {
    entry: 'itau-uy-card-utils.user.js'
  },
  format: 'iife',
  target: 'browser',
  sourcemap: 'none',
  external: ['@violentmonkey/ui', '@violentmonkey/dom']
})

if (!result.success) {
  console.error('Build failed:', result.logs)
  process.exit(1)
}

// Get the built file
const outputPath = join('./dist', 'itau-uy-card-utils.user.js')
const builtFile = readFileSync(outputPath, 'utf-8')

// Combine metadata with built file
const finalContent = `${metaTemplate}\n\n${builtFile}`

// Write the final userscript
await Bun.write(outputPath, finalContent)

console.log('Build completed successfully!')
