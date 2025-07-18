/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',

    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],

      thresholds: {
        statements: 80,
        branches: 50,
        functions: 50,
        lines: 50,
      },

      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/main.tsx', 'src/vite-env.d.ts', 'src/setupTests.ts', 'src/types', 'src/**/*.types.ts'],
    }
  },
});
