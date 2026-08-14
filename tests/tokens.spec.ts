import { describe, expect, it } from 'vitest'
import { CLAUDE_THEMES } from '../src/tokens.js'

describe('Claude theme token contract', () => {
  it('provides the complete light and dark semantic token sets', () => {
    expect(CLAUDE_THEMES).toEqual({
      'claude-sandstone': {
        colorScheme: 'light',
        tokens: expect.objectContaining({
          '--claude-base': expect.any(String),
          '--claude-layer': expect.any(String),
          '--claude-overlay': expect.any(String),
          '--claude-border-l1': expect.any(String),
          '--claude-border-l2': expect.any(String),
          '--claude-brand-primary': expect.any(String),
          '--claude-label-primary': expect.any(String),
          '--claude-label-secondary': expect.any(String),
          '--claude-state-success': expect.any(String),
          '--claude-state-warn': expect.any(String),
          '--claude-state-error': expect.any(String),
          '--claude-sidebar-fill': expect.any(String),
        }),
      },
      'claude-ink': {
        colorScheme: 'dark',
        tokens: expect.objectContaining({
          '--claude-base': expect.any(String),
          '--claude-layer': expect.any(String),
          '--claude-overlay': expect.any(String),
          '--claude-border-l1': expect.any(String),
          '--claude-border-l2': expect.any(String),
          '--claude-brand-primary': expect.any(String),
          '--claude-label-primary': expect.any(String),
          '--claude-label-secondary': expect.any(String),
          '--claude-state-success': expect.any(String),
          '--claude-state-warn': expect.any(String),
          '--claude-state-error': expect.any(String),
          '--claude-sidebar-fill': expect.any(String),
        }),
      },
    })
  })
})
