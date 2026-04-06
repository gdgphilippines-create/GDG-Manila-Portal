export const colors = {
  brand: {
    blue: '#4285F4',
    green: '#34A853',
    yellow: '#F9AB00',
    red: '#EA4335',
    instagram: '#A855F7',
    'instagram-soft': '#F3E8FF',
    facebook: '#4285F4',
    'facebook-soft': '#E8F0FE',
    linkedin: '#57CAFF',
    'linkedin-soft': '#C3ECF6',
    bevy: '#E98A5B',
    'bevy-soft': '#FCE7DE',
  },
  pastel: {
    blue: '#C3ECF6',
    green: '#CCF6C5',
    yellow: '#FFE7A5',
    red: '#F8D8D8',
  },
  halftone: {
    blue: '#57CAFF',
    green: '#5CDB6D',
    yellow: '#FFD427',
    pink: '#FF7DAF',
  },
  neutral: {
    nearBlack: '#1E1E1E',
    offwhite: '#F0F0F0',
    white: '#FFFFFF',
    slate50: '#F8FAFC',
    slate200: '#E2E8F0',
    slate400: '#94A3B8',
    slate500: '#64748B',
    slate600: '#475569',
  },
}

export function hexToRgbChannels(hex) {
  const normalized = hex.replace('#', '')
  const value = normalized.length === 3
    ? normalized
        .split('')
        .map((char) => `${char}${char}`)
        .join('')
    : normalized

  const int = Number.parseInt(value, 16)

  return [
    (int >> 16) & 255,
    (int >> 8) & 255,
    int & 255,
  ]
}

export function hexToRgbVar(hex) {
  return hexToRgbChannels(hex).join(' ')
}
