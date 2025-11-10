import type { Config } from 'tailwindcss'
import fidusTailwindPreset from '@fidus/ui/tailwind'

const config: Config = {
  presets: [fidusTailwindPreset],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
}

export default config
