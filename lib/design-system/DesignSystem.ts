import {
  Colors,
  Typography,
  Spacing,
  Rounded,
  Shadows,
  type ColorToken,
  type SpacingToken,
  type RoundedToken,
  type TypographyToken,
} from './tokens'

// camelCase → kebab-case
function toKebab(str: string): string {
  return str.replace(/([A-Z])/g, (c) => `-${c.toLowerCase()}`)
}

export class DesignSystem {
  // ─── Static token maps (read-only access) ─────────────────────────────────
  static readonly colors     = Colors
  static readonly typography = Typography
  static readonly spacing    = Spacing
  static readonly rounded    = Rounded
  static readonly shadows    = Shadows

  // ─── CSS variable name helpers ─────────────────────────────────────────────
  static colorVar(token: ColorToken): string {
    return `var(--color-${toKebab(token)})`
  }

  static spacingVar(token: SpacingToken): string {
    return `var(--spacing-${toKebab(token)})`
  }

  static roundedVar(token: RoundedToken = 'DEFAULT'): string {
    const key = token === 'DEFAULT' ? 'default' : toKebab(token)
    return `var(--rounded-${key})`
  }

  // ─── Direct value access ───────────────────────────────────────────────────
  static color(token: ColorToken): string {
    return Colors[token]
  }

  static space(token: SpacingToken): string {
    return Spacing[token]
  }

  static radius(token: RoundedToken = 'DEFAULT'): string {
    return Rounded[token]
  }

  static text(token: TypographyToken) {
    return Typography[token]
  }

  // ─── CSS variable map (used by ThemeProvider to inject :root vars) ─────────
  static toCSSVariables(): Record<string, string> {
    const vars: Record<string, string> = {}

    for (const [key, value] of Object.entries(Colors)) {
      vars[`--color-${toKebab(key)}`] = value
    }

    for (const [key, value] of Object.entries(Spacing)) {
      vars[`--spacing-${toKebab(key)}`] = value
    }

    for (const [key, value] of Object.entries(Rounded)) {
      const k = key === 'DEFAULT' ? 'default' : toKebab(key)
      vars[`--rounded-${k}`] = value
    }

    for (const [key, value] of Object.entries(Shadows)) {
      vars[`--shadow-${toKebab(key)}`] = value
    }

    return vars
  }

  // ─── CSS :root block string (for <style> injection) ───────────────────────
  static toRootCSS(): string {
    const entries = Object.entries(this.toCSSVariables())
      .map(([k, v]) => `  ${k}: ${v};`)
      .join('\n')
    return `:root {\n${entries}\n}`
  }
}
