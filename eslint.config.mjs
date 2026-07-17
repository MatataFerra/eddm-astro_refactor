import eslintPluginAstro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';
import sveltePlugin from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';
import * as astroParser from 'astro-eslint-parser';

export default [
  // 1. Configuraciones base de los plugins
  ...eslintPluginAstro.configs.recommended,
  ...sveltePlugin.configs.recommended,
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

  // 3. Configuración específica para SVELTE
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tseslint.parser,
      },
    },
    rules: {
      'no-console': 'warn',
      'svelte/no-keyed-each': 'off',
      'svelte/valid-each-key': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },

  // 4. Configuración para JS/TS puros
  {
    files: ['**/*.{js,ts,mjs,mts}'],
    rules: {
      'no-console': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },

  // 5. Ignorar carpetas de build
  {
    ignores: ['dist/', '.astro/', 'node_modules/', '.vercel/'],
  },
];
