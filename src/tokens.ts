/** One named color scheme supplied to the Harness theme registry. */
export interface ClaudeThemeDefinition {
  readonly colorScheme: 'light' | 'dark'
  readonly tokens: Readonly<Record<string, string>>
}

/** Semantic aliases shared by the light sandstone and dark ink themes. */
const sandstoneTokens = {
  '--claude-base': '#f7f5f2',
  '--claude-layer': '#fffdf9',
  '--claude-overlay': '#ffffff',
  '--claude-border-l1': '#e6e0d8',
  '--claude-border-l2': '#d5ccc1',
  '--claude-brand-primary': '#c15f3c',
  '--claude-label-primary': '#292522',
  '--claude-label-secondary': '#6e665f',
  '--claude-state-success': '#2f7d59',
  '--claude-state-warn': '#a96811',
  '--claude-state-error': '#b64038',
  '--claude-sidebar-fill': '#efebe5',
} as const

const inkTokens = {
  '--claude-base': '#1d1b1a',
  '--claude-layer': '#272421',
  '--claude-overlay': '#322e2a',
  '--claude-border-l1': '#48413b',
  '--claude-border-l2': '#60574f',
  '--claude-brand-primary': '#e07b55',
  '--claude-label-primary': '#f3eee8',
  '--claude-label-secondary': '#c4bbb1',
  '--claude-state-success': '#67b889',
  '--claude-state-warn': '#e3a54b',
  '--claude-state-error': '#e47a70',
  '--claude-sidebar-fill': '#24211f',
} as const

/** The complete plugin-owned palette contract, keyed by Harness theme id. */
export const CLAUDE_THEMES = {
  'claude-sandstone': {
    colorScheme: 'light',
    tokens: sandstoneTokens,
  },
  'claude-ink': {
    colorScheme: 'dark',
    tokens: inkTokens,
  },
} as const satisfies Readonly<Record<string, ClaudeThemeDefinition>>

export type ClaudeThemeId = keyof typeof CLAUDE_THEMES
