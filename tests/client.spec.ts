import { describe, expect, it } from 'vitest'
import { apply, inject, THEME_STYLESHEET } from '../src/client/index.js'
import { ThemeSelectorRow } from '../src/client/ThemeSelectorRow.js'

type ThemeButton = { props: { children: string; 'aria-pressed': boolean; onClick: () => void } }
type ThemeSelectorTree = { props: { children: [unknown, { props: { children: ThemeButton[] } }] } }

describe('Claude Web client plugin', () => {
  it('declares theme injection so the Cordis loader parks it before apply', () => {
    expect(inject).toEqual(['theme', 'slots'])
  })

  it('has a loader-shaped gate that avoids invoking apply until theme exists', () => {
    let applyCalls = 0
    const plugin = { inject, apply: () => { applyCalls += 1 } }
    const mount = (services: Record<string, unknown>): 'parked' | 'active' => {
      if (!plugin.inject.every(name => name in services)) return 'parked'
      plugin.apply()
      return 'active'
    }

    expect(mount({})).toBe('parked')
    expect(applyCalls).toBe(0)
    expect(mount({ theme: {}, slots: {} })).toBe('active')
    expect(applyCalls).toBe(1)
  })

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
      on: () => () => {},
      slots: {
        inject: (_name: string, callback: () => () => void) => { callback(); return () => {} },
        register: () => () => {},
      },
    }

    apply(ctx as never)

    expect(registered.map(theme => theme.id)).toEqual(['claude-sandstone', 'claude-ink'])
    expect(registered.map(theme => theme.colorScheme)).toEqual(['light', 'dark'])
    for (const dispose of effects.reverse()) dispose()
    expect(registered).toEqual([])
  })

  it('registers a selector that reads, switches, syncs, and disposes through public services', () => {
    let active = 'claude-sandstone'
    const setThemeCalls: string[] = []
    let changeListener: ((snapshot: { preference: string }) => void) | undefined
    let slotDisposed = false
    let listenerDisposed = false
    let selector: unknown
    let slotInjection: (() => () => void) | undefined
    let activeRegistration: (() => void) | undefined
    const effectDisposers: Array<() => void> = []
    const ctx = {
      theme: {
        register: () => () => {},
        getTheme: () => ({ preference: active }),
        setTheme: (id: string) => { setThemeCalls.push(id) },
      },
      slots: {
        inject: (_name: string, callback: () => () => void) => {
          slotInjection = callback
          return () => {
            slotInjection = undefined
            activeRegistration?.()
          }
        },
        register: (_options: { name: string; id: string; order: number }, component: typeof selector) => {
          selector = component
          return () => { slotDisposed = true }
        },
      },
      on: (_name: 'theme/change', listener: (snapshot: { preference: string }) => void) => {
        changeListener = listener
        return () => { listenerDisposed = true }
      },
      effect: (effect: () => void | (() => void)) => {
        const dispose = effect()
        if (dispose !== undefined) effectDisposers.push(dispose)
      },
    }

    apply(ctx as never)
    expect(slotInjection).toBeTypeOf('function')
    activeRegistration = slotInjection?.()
    expect(selector).toBeTypeOf('function')

    const sandstone = ThemeSelectorRow({ preference: active, setTheme: ctx.theme.setTheme }) as ThemeSelectorTree
    const buttons = sandstone.props.children[1].props.children
    expect(buttons.map(button => (button.props.children as unknown as Array<{ props: { children: string } }>)[0].props.children))
      .toEqual(['Claude Sandstone', 'Claude Ink'])
    expect(buttons.map(button => button.props['aria-pressed'])).toEqual([true, false])
    buttons[1].props.onClick()
    expect(setThemeCalls).toEqual(['claude-ink'])

    active = 'claude-ink'
    changeListener?.({ preference: active })
    const ink = ThemeSelectorRow({ preference: active, setTheme: ctx.theme.setTheme }) as ThemeSelectorTree
    expect(ink.props.children[1].props.children.map(button => button.props['aria-pressed'])).toEqual([false, true])

    for (const dispose of effectDisposers) dispose()
    expect(listenerDisposed).toBe(true)
    expect(slotDisposed).toBe(true)
    expect(slotInjection).toBeUndefined()
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
