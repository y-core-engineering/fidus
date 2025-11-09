import type { Config } from 'tailwindcss';

/**
 * Fidus UI Tailwind Preset
 *
 * This preset provides all the custom Tailwind configuration needed to use @fidus/ui components.
 * External projects should import this preset in their tailwind.config.ts file.
 *
 * @example
 * ```typescript
 * // tailwind.config.ts
 * import type { Config } from 'tailwindcss';
 * import fidusTailwindPreset from '@fidus/ui/tailwind';
 *
 * const config: Config = {
 *   presets: [fidusTailwindPreset],
 *   content: [
 *     './src/**\/*.{js,ts,jsx,tsx}',
 *     './node_modules/@fidus/ui/dist/**\/*.{js,mjs}',
 *   ],
 *   // Your custom configuration...
 * };
 *
 * export default config;
 * ```
 */
/**
 * Color helper function for HSL with opacity support
 *
 * Uses callback pattern instead of <alpha-value> placeholder because:
 * - Tailwind CSS v3.4+ inconsistently strips hsl() wrapper from string values
 * - Callback pattern forces Tailwind to preserve hsl() in all setups
 * - Enables opacity modifiers (e.g., bg-primary/50)
 *
 * @param variable - CSS custom property name (e.g., '--color-primary')
 * @returns Tailwind color function that generates: hsl(var(--color-primary) / <opacity>)
 */
const hslColor = (variable: string) => {
  return (({ opacityValue }: { opacityValue?: string }) => {
    if (opacityValue !== undefined) {
      return `hsl(var(${variable}) / ${opacityValue})`;
    }
    return `hsl(var(${variable}) / 1)`;
  }) as any;
};

const fidusTailwindPreset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: hslColor('--color-primary'),
          foreground: hslColor('--color-primary-foreground'),
          hover: hslColor('--color-primary-hover'),
          active: hslColor('--color-primary-active'),
        },
        black: hslColor('--color-black'),
        white: hslColor('--color-white'),
        trust: {
          local: hslColor('--color-trust-local'),
          cloud: hslColor('--color-trust-cloud'),
          encrypted: hslColor('--color-trust-encrypted'),
        },
        success: hslColor('--color-success'),
        warning: hslColor('--color-warning'),
        error: hslColor('--color-error'),
        info: hslColor('--color-info'),
        urgent: hslColor('--color-urgent'),
        medium: hslColor('--color-medium'),
        low: hslColor('--color-low'),
        background: hslColor('--color-background'),
        foreground: hslColor('--color-foreground'),
        muted: {
          DEFAULT: hslColor('--color-muted'),
          foreground: hslColor('--color-muted-foreground'),
        },
        border: hslColor('--color-border'),
        input: hslColor('--color-input-bg'),
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
      fontSize: {
        xs: 'var(--font-size-xs)',
        sm: 'var(--font-size-sm)',
        md: 'var(--font-size-md)',
        lg: 'var(--font-size-lg)',
        xl: 'var(--font-size-xl)',
        '2xl': 'var(--font-size-2xl)',
        '3xl': 'var(--font-size-3xl)',
        '4xl': 'var(--font-size-4xl)',
      },
      lineHeight: {
        tight: 'var(--line-height-tight)',
        normal: 'var(--line-height-normal)',
        relaxed: 'var(--line-height-relaxed)',
      },
      spacing: {
        xs: 'var(--spacing-xs)',
        sm: 'var(--spacing-sm)',
        md: 'var(--spacing-md)',
        lg: 'var(--spacing-lg)',
        xl: 'var(--spacing-xl)',
        '2xl': 'var(--spacing-2xl)',
        '3xl': 'var(--spacing-3xl)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        full: 'var(--radius-full)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
      },
      zIndex: {
        base: 'var(--z-base)',
        dropdown: 'var(--z-dropdown)',
        sticky: 'var(--z-sticky)',
        overlay: 'var(--z-overlay)',
        sidebar: 'var(--z-sidebar)',
        modal: 'var(--z-modal)',
        popover: 'var(--z-popover)',
        tooltip: 'var(--z-tooltip)',
      },
      transitionDuration: {
        fast: 'var(--duration-fast)',
        normal: 'var(--duration-normal)',
        slow: 'var(--duration-slow)',
      },
      transitionTimingFunction: {
        standard: 'var(--easing-standard)',
        decelerate: 'var(--easing-decelerate)',
        accelerate: 'var(--easing-accelerate)',
      },
    },
  },
  darkMode: 'class',
};

export default fidusTailwindPreset;
