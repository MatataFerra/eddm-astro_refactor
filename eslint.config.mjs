import eslintPluginAstro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';
import sveltePlugin from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';
import astroParser from 'astro-eslint-parser';

export default [
  // 1. Configuraciones base de los plugins
  ...eslintPluginAstro.configs.recommended,
  ...sveltePlugin.configs['flat/recommended'],
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
      // Desactivamos la obligatoriedad de la key en los bloques cada
      'svelte/no-keyed-each': 'off',
      // O si el error viene de svelte/block-lang-config o similar:
      'svelte/valid-each-key': 'off',
    },
  },

  // 4. Configuración para JS/TS puros
  {
    files: ['**/*.{js,ts,mjs,mts}'],
    rules: {
      'no-console': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },

  // 5. Ignorar carpetas de build
  {
    ignores: ['dist/', '.astro/', 'node_modules/'],
  },
];
