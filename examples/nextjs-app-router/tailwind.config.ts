import type { Config } from 'tailwindcss'
import fidusTailwindPreset from '@fidus/ui/tailwind'

const config: Config = {
  presets: [fidusTailwindPreset],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
}

export default config
