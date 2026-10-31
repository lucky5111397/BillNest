/**
 * BillNest Design System: Corporate Precision Billing
 * Theme: Matte Black & Chrome Grey
 *
 * Source: Stitch Project 10541086602125467481 (Brightloop OS Revenue Platform)
 */

export const DESIGN_TOKENS = {
  colors: {
    canvas: '#08080A',
    surface: {
      lowest: '#0E0E10',
      default: '#131315',
      variant: '#141519',
      bright: '#1F2128',
      high: '#2A2A2C',
    },
    text: {
      primary: '#F8FAFC',
      secondary: '#8E95A5',
    },
    telemetry: {
      cyan: '#67E8F9',
      success: '#10B981',
      danger: '#F43F5E',
    },
    borders: {
      subtle: 'rgba(226, 232, 240, 0.12)',
      specular: 'rgba(226, 232, 240, 0.28)',
    },
    metallic: {
      light: '#F8FAFC',
      mid: '#CBD5E1',
      dark: '#94A3B8',
    },
  },
  typography: {
    fontSans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontMono: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
  },
} as const;

export type DesignTokens = typeof DESIGN_TOKENS;
