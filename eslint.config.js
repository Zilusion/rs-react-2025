import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const config = [
  ...compat.config({ extends: ['next', 'next/core-web-vitals', 'next/typescript', 'prettier', 'plugin:@tanstack/eslint-plugin-query/recommended'] }),
];

export default config;