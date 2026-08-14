import type { ThemeRuntime } from '@deepseek-ai/dsh-client-ui-theme/client'
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
[data-input-scroll] { scrollbar-color: var(--dsw-alias-scrollbar-bg-l2) var(--dsw-alias-bg-layer-1); }
[data-tool] { border-radius: 12px; border-color: var(--dsw-alias-border-l1); }
.md-code-block { border-radius: 12px; background: var(--dsw-alias-markdown-code-block); }
[data-conversation-scroll] { scrollbar-color: var(--dsw-alias-scrollbar-bg-l1) var(--dsw-alias-bg-base); }
`
