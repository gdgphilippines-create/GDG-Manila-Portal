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

export const tonePatterns = {
  accentActionClassNames: {
    amber:
      'border-warning/30 bg-warning-bg/80 text-warning hover:border-warning/60 hover:bg-warning-bg',
    emerald:
      'border-success/30 bg-success-bg/80 text-success hover:border-success/60 hover:bg-success-bg',
    rose:
      'border-error/30 bg-error-bg/80 text-error hover:border-error/60 hover:bg-error-bg',
  },
  statusClassNames: {
    success: 'bg-success-bg text-success border-success/20',
    warning: 'bg-warning/15 text-warning border-warning/20',
    danger: 'bg-error-bg text-error border-error/20',
    neutral: 'bg-footer text-muted border-divider',
  },
}

export const streamStatusClassNames = {
  waiting: {
    active: 'border-divider bg-footer text-body',
    inactive: 'border-transparent bg-transparent text-muted hover:text-body',
  },
  live: {
    active: 'border-success-border/30 bg-success-bg text-success',
    inactive: 'border-transparent bg-transparent text-muted hover:text-success',
  },
  ended: {
    active: 'border-error-border/30 bg-error-bg text-error',
    inactive: 'border-transparent bg-transparent text-muted hover:text-error',
  },
}

export const headerStatusClassNames = {
  warning: {
    className: 'border-divider bg-footer text-body',
  },
  success: {
    className: 'border-success-border/30 bg-success-bg text-success',
  },
  danger: {
    className: 'border-error-border/30 bg-error-bg text-error',
  },
  neutral: {
    className: 'border-divider bg-footer text-body',
  },
}

export function getInteractiveTabClassName(isActive) {
  const activeTabClassName = ''
  const inactiveTabClassName = 'active:translate-y-px'

  return `relative inline-flex rounded-t-2xl px-1 pb-4 pt-1 transition-all duration-200 ${
    isActive ? activeTabClassName : inactiveTabClassName
  }`
}

export function getInteractiveTabTextClassName(isActive) {
  return isActive ? 'text-primary' : 'text-muted transition-colors duration-200 hover:text-primary'
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
