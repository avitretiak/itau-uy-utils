import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import eslintJs from '@eslint/js'
import prettier from 'eslint-config-prettier'

export default [
  // Base ESLint config
  eslintJs.configs.recommended,

  // TypeScript config
  {
    files: ['src/**/*.ts', 'build.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      globals: {
        // Browser globals
        window: true,
        document: true,
        HTMLElement: true,
        HTMLTableElement: true,
        HTMLTableRowElement: true,
        HTMLInputElement: true,
        HTMLDivElement: true,
        MutationObserver: true,
        Blob: true,
        URL: true,
        // Node.js globals
        console: true,
        process: true,
        // Bun globals
        Bun: true
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ]
    }
  },

  // Prettier config
  {
    files: ['**/*'],
    ...prettier
  },

  // Ignore patterns for non-source files
  {
    ignores: ['dist/**', 'node_modules/**', '*.config.js', '*.d.ts']
  }
]
