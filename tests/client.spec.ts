import { describe, expect, it } from 'vitest'
import { apply, THEME_STYLESHEET } from '../src/client/index.js'

describe('Claude Web client plugin', () => {
  it('registers both selectable themes through the public theme service', () => {
    const registered: Array<{ id: string; colorScheme: string; tokens: Record<string, string> }> = []
    const effects: Array<() => void> = []
    const ctx = {
      theme: {
        register: (definition: { id: string; colorScheme: string; tokens: Record<string, string> }) => {
          registered.push(definition)
          return () => { registered.splice(registered.indexOf(definition), 1) }
        },
      },
      effect: (effect: () => void | (() => void)) => {
        const dispose = effect()
        if (dispose !== undefined) effects.push(dispose)
      },
    }

    apply(ctx as never)

    expect(registered.map(theme => theme.id)).toEqual(['claude-sandstone', 'claude-ink'])
    expect(registered.map(theme => theme.colorScheme)).toEqual(['light', 'dark'])
    for (const dispose of effects.reverse()) dispose()
    expect(registered).toEqual([])
  })

  it('ships a local semantic stylesheet with only verified targets', () => {
    expect(THEME_STYLESHEET).toContain('[data-composer-card]')
    expect(THEME_STYLESHEET).toContain('[data-input-scroll]')
    expect(THEME_STYLESHEET).toContain('[data-tool]')
    expect(THEME_STYLESHEET).toContain('.md-code-block')
    expect(THEME_STYLESHEET).toContain('[data-conversation-scroll]')
    expect(THEME_STYLESHEET).toMatch(/var\(--dsw-alias-[\w-]+\)/)
    expect(THEME_STYLESHEET).not.toMatch(/https?:|@import|url\(/i)
  })

  it('uses mutually exclusive Firefox and WebKit scrollbar support paths', () => {
    expect(THEME_STYLESHEET).toContain('@supports not selector(::-webkit-scrollbar)')
    expect(THEME_STYLESHEET).toContain('@supports selector(::-webkit-scrollbar)')
    expect(THEME_STYLESHEET).toContain('::-webkit-scrollbar-thumb')
    expect(THEME_STYLESHEET).toMatch(/::-webkit-scrollbar-thumb[^}]*var\(--dsw-alias-scrollbar-bg-l1\)/)
    expect(THEME_STYLESHEET).toMatch(/::-webkit-scrollbar-track[^}]*var\(--dsw-alias-bg-base\)/)
  })
})
