import type { ThemeRuntime } from '../client-contract.js'
import { CLAUDE_THEMES } from '../tokens.js'
import './theme.module.css'

/**
 * Browser plugin body. Both registrations belong to this client's Fiber:
 * Context.effect owns their ThemeRuntime disposers on reload or unmount.
 */
export function apply(ctx: { theme: ThemeRuntime; effect(effect: () => void | (() => void), label?: string): void }): void {
  for (const [id, theme] of Object.entries(CLAUDE_THEMES)) {
    ctx.effect(() => ctx.theme.register({ id, ...theme }), `claude-web-theme: ${id}`)
  }
}

/** Test-visible source contract; the bundled CSS module performs static loading. */
export const THEME_STYLESHEET = `
[data-composer-card] { border-radius: 18px; border-color: var(--dsw-alias-border-l2); background: var(--dsw-alias-bg-layer-1); }
[data-composer-card]:focus-within { outline: 2px solid var(--dsw-alias-brand-primary); outline-offset: 2px; }
[data-tool] { border-radius: 12px; border-color: var(--dsw-alias-border-l1); }
.md-code-block { border-radius: 12px; background: var(--dsw-alias-markdown-code-block); }
@supports not selector(::-webkit-scrollbar) { [data-input-scroll] { scrollbar-color: var(--dsw-alias-scrollbar-bg-l2) var(--dsw-alias-bg-layer-1); } [data-conversation-scroll] { scrollbar-color: var(--dsw-alias-scrollbar-bg-l1) var(--dsw-alias-bg-base); } }
@supports selector(::-webkit-scrollbar) { [data-input-scroll]::-webkit-scrollbar, [data-conversation-scroll]::-webkit-scrollbar { width: 10px; height: 10px; } [data-input-scroll]::-webkit-scrollbar-track { background: var(--dsw-alias-bg-layer-1); } [data-conversation-scroll]::-webkit-scrollbar-track { background: var(--dsw-alias-bg-base); } [data-input-scroll]::-webkit-scrollbar-thumb { background: var(--dsw-alias-scrollbar-bg-l2); } [data-conversation-scroll]::-webkit-scrollbar-thumb { background: var(--dsw-alias-scrollbar-bg-l1); } [data-input-scroll]::-webkit-scrollbar-thumb:hover { background: var(--dsw-alias-scrollbar-hover-l2); } [data-conversation-scroll]::-webkit-scrollbar-thumb:hover { background: var(--dsw-alias-scrollbar-hover-l1); } }
`
