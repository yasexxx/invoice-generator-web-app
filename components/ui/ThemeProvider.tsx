import { DesignSystem } from '@/lib/design-system'

// Server component — injects CSS custom properties into :root before first paint.
// This is the bridge between the TypeScript SSOT and the CSS layer.
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: DesignSystem.toRootCSS() }} />
      {children}
    </>
  )
}
