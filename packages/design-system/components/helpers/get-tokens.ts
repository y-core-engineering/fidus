// Utility to read design tokens directly from globals.css
// This ensures the documentation always reflects the actual CSS variables

export interface DesignToken {
  name: string;
  variable: string;
  value: string;
  category: string;
}

/**
 * Extract all CSS variable names from computed styles
 */
function extractCSSVariables(): string[] {
  if (typeof window === 'undefined') {
    return []; // SSR fallback
  }

  const computedStyle = getComputedStyle(document.documentElement);
  const variables: string[] = [];

  // Iterate through all CSS properties
  for (let i = 0; i < computedStyle.length; i++) {
    const propertyName = computedStyle[i];

    // Only include Fidus design tokens (exclude Tailwind internal variables)
    if (propertyName.startsWith('--') && !propertyName.startsWith('--tw-')) {
      variables.push(propertyName);
    }
  }

  return variables.sort();
}

/**
 * Get the actual value of a CSS variable from the DOM
 */
function getCSSVariableValue(variableName: string): string {
  if (typeof window === 'undefined') {
    return ''; // SSR fallback
  }

  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(variableName)
    .trim();

  return value;
}

/**
 * Convert CSS variable name to human-readable name
 * Example: --color-primary-hover → Primary Hover
 */
function variableToName(variable: string): string {
  return variable
    .replace(/^--[a-z]+-/, '') // Remove prefix like --color-, --spacing-
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Determine category from variable name
 */
function getCategory(variable: string): string {
  if (variable.startsWith('--color-')) return 'color';
  if (variable.startsWith('--spacing-')) return 'spacing';
  if (variable.startsWith('--radius-')) return 'radius';
  if (variable.startsWith('--shadow-')) return 'shadow';
  if (variable.startsWith('--z-')) return 'zIndex';
  if (variable.startsWith('--font-')) return 'typography';
  if (variable.startsWith('--line-height-')) return 'typography';
  if (variable.startsWith('--duration-')) return 'motion';
  if (variable.startsWith('--easing-')) return 'motion';
  return 'other';
}

/**
 * Get all design tokens by reading CSS variables from the DOM
 */
export function getAllTokens(): DesignToken[] {
  const variables = extractCSSVariables();

  return variables.map(variable => ({
    name: variableToName(variable),
    variable,
    value: getCSSVariableValue(variable),
    category: getCategory(variable),
  }));
}

/**
 * Get tokens by category
 */
export function getTokensByCategory(category: string): DesignToken[] {
  const allTokens = getAllTokens();
  return allTokens.filter(token => token.category === category);
}
