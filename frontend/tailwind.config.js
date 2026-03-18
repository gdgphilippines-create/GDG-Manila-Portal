import plugin from 'tailwindcss/plugin'
import { createRootColorVariables, theme } from './src/styles/theme.js'
import { layout } from './src/styles/layout.js'
import { typography } from './src/styles/typography.js'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: typography.fonts.sans,
        display: typography.fonts.display,
        label: typography.fonts.label,
      },
      fontSize: typography.scale,
      borderRadius: {
        field: layout.radius.field,
        panel: layout.radius.panel,
        pill: layout.radius.pill,
        card: layout.radius.card,
        dialog: layout.radius.dialog,
        logo: layout.radius.logo,
        button: layout.radius.button,
        avatar: layout.radius.avatar,
      },
      boxShadow: {
        card: layout.shadow.card,
        dropdown: layout.shadow.dropdown,
        session: layout.shadow.session,
        auth: layout.shadow.auth,
        cta: layout.shadow.cta,
        timeline: layout.shadow.timeline,
      },
      maxWidth: {
        content: layout.content.max,
        'card-narrow': layout.content.cardNarrow,
      },
      spacing: {
        'nav-x': layout.spacing.navX,
        'nav-y': layout.spacing.navY,
        'section-x': layout.spacing.sectionX,
        'section-y': layout.spacing.sectionY,
        'card-x': layout.spacing.cardX,
        'card-y': layout.spacing.cardY,
        'footer-x': layout.spacing.footerX,
        'footer-y': layout.spacing.footerY,
        'section-gap': layout.spacing.sectionGap,
      },
      backdropBlur: {
        frosted: layout.blur.frosted,
      },
      colors: {
        primary: 'rgb(var(--theme-primary) / <alpha-value>)',
        secondary: 'rgb(var(--theme-secondary) / <alpha-value>)',
        accent: 'rgb(var(--theme-accent) / <alpha-value>)',
        neutral: 'rgb(var(--theme-neutral) / <alpha-value>)',
        overtone: 'rgb(var(--theme-overtone) / <alpha-value>)',
        body: 'rgb(var(--color-text-body) / <alpha-value>)',
        heading: 'rgb(var(--color-text-heading) / <alpha-value>)',
        muted: 'rgb(var(--color-text-muted) / <alpha-value>)',
        error: 'rgb(var(--color-text-error) / <alpha-value>)',
        success: 'rgb(var(--color-text-success) / <alpha-value>)',
        warning: 'rgb(var(--color-text-warning) / <alpha-value>)',
        page: 'rgb(var(--color-bg-page) / <alpha-value>)',
        card: 'rgb(var(--color-bg-card) / <alpha-value>)',
        footer: 'rgb(var(--color-bg-footer) / <alpha-value>)',
        'primary-bg': 'rgb(var(--color-bg-primary) / <alpha-value>)',
        'secondary-bg': 'rgb(var(--color-bg-secondary) / <alpha-value>)',
        'accent-bg': 'rgb(var(--color-bg-accent) / <alpha-value>)',
        'success-bg': 'rgb(var(--color-success-bg) / <alpha-value>)',
        'error-bg': 'rgb(var(--color-error-bg) / <alpha-value>)',
        'warning-bg': 'rgb(var(--color-bg-warning) / <alpha-value>)',
        divider: 'rgb(var(--color-border-default) / <alpha-value>)',
        'divider-soft': 'rgb(var(--color-border-subtle) / <alpha-value>)',
        'border-card': 'rgb(var(--color-border-card) / <alpha-value>)',
        'success-border': 'rgb(var(--color-success-border) / <alpha-value>)',
        'error-border': 'rgb(var(--color-error-border) / <alpha-value>)',
        brand: theme.palette.brand,
        pastel: theme.palette.pastel,
        halftone: theme.palette.halftone,
        slate: {
          50: theme.palette.neutral.slate50,
          200: theme.palette.neutral.slate200,
          400: theme.palette.neutral.slate400,
          500: theme.palette.neutral.slate500,
          600: theme.palette.neutral.slate600,
        },
      },
    },
  },
  plugins: [
    plugin(({ addBase, addComponents }) => {
      addBase({
        ':root': createRootColorVariables(),
      })

      addComponents({
        '.layout-page': {
          minHeight: '100vh',
          paddingLeft: layout.spacing.sectionX,
          paddingRight: layout.spacing.sectionX,
          paddingTop: layout.spacing.sectionY,
          paddingBottom: layout.spacing.sectionY,
        },
        '.layout-content': {
          width: '100%',
          maxWidth: layout.content.max,
          marginLeft: 'auto',
          marginRight: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: layout.spacing.sectionGap,
        },
        '.surface-card': {
          borderRadius: layout.radius.card,
          boxShadow: layout.shadow.card,
        },
        '.surface-dialog': {
          borderRadius: layout.radius.dialog,
          boxShadow: layout.shadow.dropdown,
        },
        '.surface-auth': {
          borderRadius: layout.radius.card,
          boxShadow: layout.shadow.auth,
        },
        '.pad-card': {
          paddingLeft: layout.spacing.cardX,
          paddingRight: layout.spacing.cardX,
          paddingTop: layout.spacing.cardY,
          paddingBottom: layout.spacing.cardY,
        },
      })
    }),
  ],
}
