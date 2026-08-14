/**
 * Minimal public ThemeRuntime contract verified against the current Harness
 * source. It deliberately avoids a package import: an external static client
 * receives this service from the compatible Web profile through ctx injection.
 */
export interface ThemeDefinition {
  id: string
  colorScheme: 'light' | 'dark'
  tokens: Record<string, string>
}

export interface ThemeRuntime {
  register(definition: ThemeDefinition): () => void
  getTheme(): ThemeSnapshot
  setTheme(id: string): void
}

/** Public immutable state returned by `ThemeRuntime.getTheme()`. */
export interface ThemeSnapshot {
  preference: string
}

/** Minimal public settings slot registration used by this static plugin. */
export interface SlotRegistry {
  inject(name: 'settings.general.item', callback: () => () => void): () => void
  register(
    options: { name: 'settings.general.item'; id: string; order: number; inject: () => unknown },
    component: unknown,
  ): () => void
}

/** Fiber-owned client context surface supplied to a static browser plugin. */
export interface ThemeSelectorContext {
  theme: ThemeRuntime
  slots: SlotRegistry
  on(name: 'theme/change', listener: (snapshot: ThemeSnapshot) => void): () => void
  effect(effect: () => void | (() => void), label?: string): void
}
