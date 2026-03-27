export const layout = {
  radius: {
    field: '16px',
    panel: '20px',
    pill: '32px',
    card: '32px',
    dialog: '24px',
    innerCard: '28px',
    logo: '20px',
    button: '8px',
    avatar: '9999px',
  },
  shadow: {
    card:
      '0px 10px 30px rgba(15, 23, 42, 0.12), 0px 24px 60px rgba(66, 133, 244, 0.18)',
    dropdown: '0 8px 32px rgba(0, 0, 0, 0.12)',
    session: '0px 1px 2px rgba(15, 23, 42, 0.04)',
    auth: '0px 8px 32px rgba(0, 0, 0, 0.08)',
    cta: '0px 2px 8px rgba(66, 133, 244, 0.32)',
    timeline: '0px 0px 0px 2px rgba(66, 133, 244, 0.2)',
    avatar: '0 1px 3px rgba(15, 23, 42, 0.12), 0 1px 2px rgba(15, 23, 42, 0.08)',
    navScrolled: '0 10px 30px rgba(15, 23, 42, 0.08)',
    toast: '0 4px 12px rgba(0, 0, 0, 0.12)',
    actionPrimary: '0 1px 2px rgba(66, 133, 244, 0.12)',
    actionSuccess: '0 1px 2px rgba(52, 168, 83, 0.12)',
    actionNeutral: '0 1px 2px rgba(15, 23, 42, 0.06)',
  },
  content: {
    max: '72rem',
    cardNarrow: '600px',
  },
  spacing: {
    navX: '4rem',
    navY: '0.75rem',
    sectionX: '1rem',
    sectionY: '3rem',
    cardX: '2rem',
    cardY: '31px',
    footerX: '4rem',
    footerY: '2.5rem',
    sectionGap: '3rem',
  },
  blur: {
    frosted: '6px',
  },
}

export const surfacePatterns = {
  panelBodyClassName: 'pad-card md:px-10 md:py-10',
  bannerGradientClassName:
    'absolute inset-0 bg-[linear-gradient(135deg,_rgb(var(--color-bg-card))_0%,_rgb(var(--color-bg-page))_100%)]',
  floatingIconButtonClassName:
    'absolute right-8 top-8 inline-flex h-11 w-11 items-center justify-center rounded-full border border-divider bg-card text-muted transition-colors hover:text-heading',
}

export const typographyPatterns = {
  tabLabelClassName: 'font-sans text-sm font-medium',
}
