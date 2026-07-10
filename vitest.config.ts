import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(rootDir, 'src'),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/test/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/api/**/*.ts', 'src/configs/**/*.ts', 'src/lib/**/*.ts', 'src/app/api/**/*.ts'],
      exclude: ['src/**/test/**', 'src/**/types/**', 'src/**/*.d.ts', 'src/lib/utils/shadcn/**'],
    },
  },
})
