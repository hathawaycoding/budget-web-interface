import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['server/test/**/*.test.js', 'public/js/**/*.test.js'],
  },
});
