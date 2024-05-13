import 'dotenv/config';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
    coverage: {
      include: ['src/**/*.mts'],
      reporter: ['text', 'json', 'html'],
    },
  },
});
