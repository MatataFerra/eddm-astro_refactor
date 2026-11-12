import eslintPluginAstro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';
import * as astroParser from 'astro-eslint-parser';

export default [
  // 1. Configuraciones base de los plugins
  ...eslintPluginAstro.configs.recommended,
  ...tseslint.configs.recommended,

  // 2. Configuración específica para ASTRO
  {
    files: ['**/*.astro'],
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.astro'],
      },
    },
    rules: {
      'no-console': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },

  // 3. Configuración para JS/TS puros
  {
    files: ['**/*.{js,ts,mjs,mts}'],
    rules: {
      'no-console': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },

  // 4. Ignorar carpetas de build
  {
    ignores: ['dist/', '.astro/', 'node_modules/', '.vercel/'],
  },
];
