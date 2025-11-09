import type { Config } from 'tailwindcss';
import fidusTailwindPreset from '../ui/tailwind.config';

/**
 * Design System Tailwind Configuration
 *
 * Uses the @fidus/ui Tailwind preset to ensure design consistency
 * and proper color handling (HSL with opacity support).
 */
const config: Config = {
  presets: [fidusTailwindPreset],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    '../ui/src/**/*.{js,ts,jsx,tsx}', // Include @fidus/ui components
  ],
};

export default config;
