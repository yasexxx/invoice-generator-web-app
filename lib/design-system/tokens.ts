// ─── Single Source of Truth ───────────────────────────────────────────────────
// All design token values live here. No other file should hardcode raw values.

export const Colors = {
  // Surface scale
  surface:                  '#100e34',
  surfaceDim:               '#100e34',
  surfaceBright:            '#37355c',
  surfaceContainerLowest:   '#0b082f',
  surfaceContainerLow:      '#18173d',
  surfaceContainer:         '#1d1b41',
  surfaceContainerHigh:     '#27254c',
  surfaceContainerHighest:  '#323057',
  surfaceVariant:           '#323057',
  surfaceElevated:          '#25215A',

  // On-surface
  onSurface:                '#e3dfff',
  onSurfaceVariant:         '#c8c5d2',
  inverseSurface:           '#e3dfff',
  inverseOnSurface:         '#2e2c53',

  // Outline
  outline:                  '#928f9c',
  outlineVariant:           '#474551',
  surfaceTint:              '#c5c0ff',

  // Primary
  primary:                  '#c5c0ff',
  onPrimary:                '#2b2472',
  primaryContainer:         '#433d8b',
  onPrimaryContainer:       '#b3adff',
  inversePrimary:           '#5a54a4',
  primaryFixed:             '#e3dfff',
  primaryFixedDim:          '#c5c0ff',
  onPrimaryFixed:           '#15075e',
  onPrimaryFixedVariant:    '#423c8a',

  // Secondary
  secondary:                '#c8bfff',
  onSecondary:              '#2f246d',
  secondaryContainer:       '#483e88',
  onSecondaryContainer:     '#b9afff',
  secondaryFixed:           '#e5deff',
  secondaryFixedDim:        '#c8bfff',
  onSecondaryFixed:         '#1a0958',
  onSecondaryFixedVariant:  '#463c85',

  // Tertiary (accent / monetary)
  tertiary:                 '#f9ba74',
  onTertiary:               '#482900',
  tertiaryContainer:        '#683e00',
  onTertiaryContainer:      '#e7ab66',
  tertiaryFixed:            '#ffddba',
  tertiaryFixedDim:         '#f9ba74',
  onTertiaryFixed:          '#2b1700',
  onTertiaryFixedVariant:   '#673d00',

  // Semantic
  error:                    '#F87171',
  onError:                  '#690005',
  errorContainer:           '#93000a',
  onErrorContainer:         '#ffdad6',
  success:                  '#4ADE80',
  background:               '#100e34',
  onBackground:             '#e3dfff',

  // Text aliases
  textPrimary:              '#C8ACD6',
  textMuted:                '#8E86B0',
} as const

export const Typography = {
  displayLg: {
    fontFamily: 'Hanken Grotesk',
    fontSize: '48px',
    fontWeight: '700',
    lineHeight: '56px',
    letterSpacing: '-0.02em',
  },
  headlineLg: {
    fontFamily: 'Hanken Grotesk',
    fontSize: '32px',
    fontWeight: '600',
    lineHeight: '40px',
  },
  headlineLgMobile: {
    fontFamily: 'Hanken Grotesk',
    fontSize: '24px',
    fontWeight: '600',
    lineHeight: '32px',
  },
  titleMd: {
    fontFamily: 'Hanken Grotesk',
    fontSize: '20px',
    fontWeight: '500',
    lineHeight: '28px',
  },
  bodyLg: {
    fontFamily: 'Inter',
    fontSize: '18px',
    fontWeight: '400',
    lineHeight: '28px',
  },
  bodyMd: {
    fontFamily: 'Inter',
    fontSize: '16px',
    fontWeight: '400',
    lineHeight: '24px',
  },
  labelMd: {
    fontFamily: 'JetBrains Mono',
    fontSize: '14px',
    fontWeight: '500',
    lineHeight: '20px',
    letterSpacing: '0.05em',
  },
  labelSm: {
    fontFamily: 'JetBrains Mono',
    fontSize: '12px',
    fontWeight: '500',
    lineHeight: '16px',
    letterSpacing: '0.05em',
  },
} as const

export const Spacing = {
  base:         '4px',
  xs:           '4px',
  sm:           '8px',
  md:           '16px',
  lg:           '24px',
  xl:           '32px',
  xxl:          '48px',
  gutter:       '24px',
  marginMobile: '16px',
  maxWidth:     '1200px',
} as const

export const Rounded = {
  sm:      '0.25rem',
  DEFAULT: '0.5rem',
  md:      '0.75rem',
  lg:      '1rem',
  xl:      '1.5rem',
  full:    '9999px',
} as const

export const Shadows = {
  modal: '0 8px 32px rgba(0, 0, 0, 0.4)',
} as const

export type ColorToken   = keyof typeof Colors
export type SpacingToken = keyof typeof Spacing
export type RoundedToken = keyof typeof Rounded
export type TypographyToken = keyof typeof Typography
