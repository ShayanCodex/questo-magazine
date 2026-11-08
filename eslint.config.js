import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import oxlint from 'eslint-plugin-oxlint';

export default tseslint.config(
  {
    ignores: ['dist/**', 'node_modules/**', '.github/**']
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }
      ],
      'no-console': 'error'
    }
  },
  {
    files: ['scripts/**/*.mjs', '*.config.{js,ts,mjs}'],
    languageOptions: {
      globals: {
        console: 'readonly',
        process: 'readonly',
        fetch: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        Buffer: 'readonly',
        URL: 'readonly'
      }
    },
    rules: {
      'no-console': 'off'
    }
  },
  oxlint.configs['flat/recommended']
);
