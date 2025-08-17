import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache', 'out', '.next'],

    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
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
      },
    },
  },
});