import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false, // Disable code splitting to avoid module resolution issues
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
  bundle: true, // Explicitly bundle all non-external dependencies
  esbuildOptions(options) {
    options.banner = {
      js: '"use client";',
    };
  },
});
