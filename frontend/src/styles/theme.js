import { colors, hexToRgbVar } from './colors.js'

export const theme = {
  palette: colors,
  config: {
    primary: colors.brand.blue,
    secondary: colors.brand.green,
    accent: colors.brand.yellow,
    neutral: colors.neutral.nearBlack,
    overtone: colors.pastel.blue,
  },
  semantic: {
    text: {
      body: colors.neutral.slate600,
      heading: colors.neutral.nearBlack,
      muted: colors.neutral.slate500,
      error: colors.brand.red,
      success: colors.brand.green,
      warning: colors.brand.yellow,
      danger: colors.brand.red,
    },
    bg: {
      page: colors.neutral.offwhite,
      card: colors.neutral.white,
      footer: colors.neutral.slate50,
      primary: colors.brand.blue,
      secondary: colors.brand.green,
      accent: colors.brand.yellow,
      success: colors.pastel.green,
      error: colors.pastel.red,
      warning: colors.pastel.yellow,
      overtone: colors.pastel.blue,
    },
    border: {
      card: colors.neutral.white,
      default: colors.neutral.slate200,
      subtle: colors.neutral.slate50,
      success: colors.brand.green,
      error: colors.brand.red,
      warning: colors.brand.yellow,
      accent: colors.brand.yellow,
    },
    success: {
      bg: colors.pastel.green,
      text: colors.brand.green,
      border: colors.brand.green,
    },
    error: {
      bg: colors.pastel.red,
      text: colors.brand.red,
      border: colors.brand.red,
    },
  },
}

function flattenTokens(sectionName, values) {
  return Object.entries(values).reduce((acc, [key, value]) => {
    if (typeof value === 'string') {
      acc[`--${sectionName}-${key}`] = hexToRgbVar(value)
      return acc
    }

    Object.entries(value).forEach(([nestedKey, nestedValue]) => {
      acc[`--${sectionName}-${key}-${nestedKey}`] = hexToRgbVar(nestedValue)
    })

    return acc
  }, {})
}

export function createRootColorVariables() {
  return {
    ...flattenTokens('palette-brand', theme.palette.brand),
    ...flattenTokens('palette-pastel', theme.palette.pastel),
    ...flattenTokens('palette-halftone', theme.palette.halftone),
    ...flattenTokens('palette-neutral', theme.palette.neutral),
    ...flattenTokens('theme', theme.config),
    ...flattenTokens('color-text', theme.semantic.text),
    ...flattenTokens('color-bg', theme.semantic.bg),
    ...flattenTokens('color-border', theme.semantic.border),
    ...flattenTokens('color-success', theme.semantic.success),
    ...flattenTokens('color-error', theme.semantic.error),
  }
}
