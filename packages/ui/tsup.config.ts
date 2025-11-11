import { defineConfig } from 'tsup';
import { readdirSync } from 'fs';
import { join } from 'path';

// Auto-detect all components for tree-shaking support
const componentsDir = join(__dirname, 'src/components');
const components = readdirSync(componentsDir, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

// Generate entry points for each component
const componentEntries = Object.fromEntries(
  components.map((comp) => [
    `${comp}/index`,
    `src/components/${comp}/index.ts`,
  ])
);

export default defineConfig({
  entry: {
    // Main barrel export (backward compatibility)
    index: 'src/index.ts',
    // Per-component exports for tree-shaking
    ...componentEntries,
    // Tailwind preset export (from root)
    tailwind: 'tailwind.config.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false, // Disabled to create explicit per-component bundles
  sourcemap: true,
  clean: true,
  treeshake: true, // Enable tree-shaking
  external: [
    'react',
    'react-dom',
    'react-markdown',
    'remark-gfm',
  ],
  bundle: true,
  esbuildOptions(options) {
    options.banner = {
      js: '"use client";',
    };
  },
});
