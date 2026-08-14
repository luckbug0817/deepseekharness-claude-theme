import { useSyncExternalStore } from 'react'
import type { ThemeSnapshot } from '../client-contract.js'
import css from './theme.module.css'

export interface ThemeSelectorRowProps {
  preference: string
  setTheme: (id: string) => void
}

export interface ThemeSelectorInjected {
  getTheme: () => ThemeSnapshot
  subscribe: (listener: () => void) => () => void
  setTheme: (id: string) => void
}

const OPTIONS = [
  { id: 'claude-sandstone', label: 'Claude Sandstone', description: 'Warm light palette.' },
  { id: 'claude-ink', label: 'Claude Ink', description: 'Deep dark palette.' },
] as const

/** Render the two available Claude palettes from the active theme preference. */
export function ThemeSelectorRow({ preference, setTheme }: ThemeSelectorRowProps) {
  return (
    <section className={css.themeSelector} aria-labelledby="claude-theme-selector-title">
      <div className={css.themeSelectorCopy}>
        <h3 id="claude-theme-selector-title" className={css.themeSelectorTitle}>Claude Theme</h3>
        <p className={css.themeSelectorDescription}>选择 Claude Sandstone 或 Claude Ink。</p>
      </div>
      <div className={css.themeSelectorOptions}>
        {OPTIONS.map(option => (
          <button
            key={option.id}
            type="button"
            className={css.themeSelectorOption}
            aria-pressed={preference === option.id}
            onClick={() => { setTheme(option.id) }}
          >
            <span className={css.themeSelectorOptionName}>{option.label}</span>
            <span className={css.themeSelectorOptionDescription}>{option.description}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

/** Connect the settings row to the public theme snapshot and change event. */
export function ConnectedThemeSelectorRow({ getTheme, subscribe, setTheme }: ThemeSelectorInjected) {
  const preference = useSyncExternalStore(subscribe, () => getTheme().preference, () => getTheme().preference)
  return <ThemeSelectorRow preference={preference} setTheme={setTheme} />
}
