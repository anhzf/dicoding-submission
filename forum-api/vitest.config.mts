import { defineConfig } from 'vitest/config';
import { configDotenv } from 'dotenv';

configDotenv();

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
