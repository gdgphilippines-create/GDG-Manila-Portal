import js from '@eslint/js'
import globals from 'globals'
import importPlugin from 'eslint-plugin-import'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', '.vite']),
  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      import: importPlugin,
    },
    settings: {
      'import/resolver': {
        alias: {
          map: [['@', './src']],
          extensions: ['.js', '.jsx', '.json'],
        },
      },
    },
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            {
              target: './src/components',
              from: ['./src/features', './src/views'],
              message:
                'Shared components must not import from features/ or views/. Move shared logic to lib/components, or pass data via props.',
            },
            {
              target: './src/api',
              from: ['./src/components', './src/features', './src/views'],
              message:
                'API modules must not import UI layers (components/features/views). Keep the API boundary UI-agnostic.',
            },
            {
              target: './src/services',
              from: ['./src/components', './src/features', './src/views'],
              message:
                'Services must not import UI layers (components/features/views). Keep services runtime/integration focused.',
            },
            {
              target: './src/styles',
              from: ['./src/components', './src/features', './src/views'],
              message:
                'Styles/tokens must not import UI layers (components/features/views). Keep styles token/helper only.',
            },
            {
              target: './src/features',
              from: ['./src/views', './src/app'],
              message:
                'Features must not import from views/ or app/. Compose features from views/routes and pass data via props/context.',
            },
            {
              target: './src/core',
              from: [
                './src/styles',
                './src/services',
                './src/api',
                './src/components',
                './src/features',
                './src/views',
                './src/app',
              ],
              message:
                'core/ must not depend on higher layers. Keep core constants/domain primitives dependency-free.',
            },
            {
              target: './src/lib',
              from: [
                './src/styles',
                './src/services',
                './src/api',
                './src/components',
                './src/features',
                './src/views',
                './src/app',
              ],
              message:
                'lib/ must not depend on higher layers. Keep utilities reusable and UI-agnostic.',
            },
          ],
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/features/*/*'],
              message:
                "Don't import internal feature modules. Import from `@/features/<feature>` (barrel) for cross-feature usage, or use relative imports within the same feature.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/features/**/*.{js,jsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/features/*'],
              message:
                'Feature code must not import other features (even via barrels). Compose features at the view/app layer; within a feature, use relative imports.',
            },
          ],
        },
      ],
    },
  },
])
