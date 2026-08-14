import { describe, expect, it } from 'vitest'
import { apply, CLAUDE_THEMES } from '../src/index.js'

describe('Claude theme token contract', () => {
  it('exports a no-op node plugin entry for Harness composition', () => {
    expect(apply()).toBeUndefined()
  })

  it('provides the complete light and dark semantic token sets', () => {
    expect(CLAUDE_THEMES).toEqual({
      'claude-sandstone': {
        colorScheme: 'light',
        tokens: expect.objectContaining({
          '--dsw-alias-bg-base': expect.any(String),
          '--dsw-alias-bg-layer-1': expect.any(String),
          '--dsw-alias-bg-overlay': expect.any(String),
          '--dsw-alias-border-l1': expect.any(String),
          '--dsw-alias-border-l2': expect.any(String),
          '--dsw-alias-brand-primary': expect.any(String),
          '--dsw-alias-label-primary': expect.any(String),
          '--dsw-alias-label-secondary': expect.any(String),
          '--dsw-alias-state-success-primary': expect.any(String),
          '--dsw-alias-state-warn-primary': expect.any(String),
          '--dsw-alias-state-error-primary': expect.any(String),
        }),
      },
      'claude-ink': {
        colorScheme: 'dark',
        tokens: expect.objectContaining({
          '--dsw-alias-bg-base': expect.any(String),
          '--dsw-alias-bg-layer-1': expect.any(String),
          '--dsw-alias-bg-overlay': expect.any(String),
          '--dsw-alias-border-l1': expect.any(String),
          '--dsw-alias-border-l2': expect.any(String),
          '--dsw-alias-brand-primary': expect.any(String),
          '--dsw-alias-label-primary': expect.any(String),
          '--dsw-alias-label-secondary': expect.any(String),
          '--dsw-alias-state-success-primary': expect.any(String),
          '--dsw-alias-state-warn-primary': expect.any(String),
          '--dsw-alias-state-error-primary': expect.any(String),
        }),
      },
    })
  })

  it('uses Harness semantic alias names, not a private palette namespace', () => {
    for (const theme of Object.values(CLAUDE_THEMES)) {
      expect(Object.keys(theme.tokens)).toEqual(expect.arrayContaining([
        '--dsw-alias-bg-base',
        '--dsw-alias-bg-layer-1',
        '--dsw-alias-bg-overlay',
        '--dsw-alias-border-l1',
        '--dsw-alias-brand-primary',
        '--dsw-alias-label-primary',
        '--dsw-alias-state-success-primary',
        '--dsw-alias-state-warn-primary',
        '--dsw-alias-state-error-primary',
      ]))
      expect(Object.keys(theme.tokens).every(name => name.startsWith('--dsw-'))).toBe(true)
    }
  })
})
