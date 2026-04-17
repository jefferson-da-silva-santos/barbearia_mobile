// src/theme/colors.ts

export const palette = {
  // Marrons e couros
  charcoal:    '#1A1210',
  darkBrown:   '#2A1C14',
  midBrown:    '#3D2B1F',
  leather:     '#7B4F2E',
  warmLeather: '#9C6B3C',
  sand:        '#C9A882',
  warmBeige:   '#E8D5B7',
  offWhite:    '#F5F0E8',
  pureWhite:   '#FDFAF6',

  // Feedback
  success:  '#4A7C59',
  error:    '#8B2E2E',
  warning:  '#8B6914',
  info:     '#2E5F8B',
} as const;

export const darkTheme = {
  background: {
    primary:   palette.charcoal,
    secondary: palette.darkBrown,
    tertiary:  palette.midBrown,
    card:      palette.darkBrown,
    input:     palette.midBrown,
  },
  text: {
    primary:   palette.offWhite,
    secondary: palette.sand,
    tertiary:  palette.warmLeather,
    inverse:   palette.charcoal,
  },
  border: {
    primary:   palette.midBrown,
    secondary: palette.leather,
    focus:     palette.sand,
  },
  accent: {
    primary:   palette.leather,
    secondary: palette.sand,
    highlight: palette.warmLeather,
  },
  status: {
    success:  '#4A7C59',
    error:    '#A83232',
    warning:  '#A07818',
    info:     '#3670A0',
    pending:  '#6B5B3E',
  },
} as const;

export const lightTheme = {
  background: {
    primary:   palette.pureWhite,
    secondary: palette.offWhite,
    tertiary:  palette.warmBeige,
    card:      palette.pureWhite,
    input:     palette.offWhite,
  },
  text: {
    primary:   palette.charcoal,
    secondary: palette.midBrown,
    tertiary:  palette.leather,
    inverse:   palette.pureWhite,
  },
  border: {
    primary:   palette.warmBeige,
    secondary: palette.sand,
    focus:     palette.leather,
  },
  accent: {
    primary:   palette.leather,
    secondary: palette.midBrown,
    highlight: palette.warmLeather,
  },
  status: {
    success:  '#3A6248',
    error:    '#8B2E2E',
    warning:  '#8B6914',
    info:     '#2E5F8B',
    pending:  '#6B5B3E',
  },
} as const;

export type Theme = typeof darkTheme;