/** Package entry; host-side registration is intentionally deferred. */
export { CLAUDE_THEMES, type ClaudeThemeDefinition, type ClaudeThemeId } from './tokens.js'

/** Node-half plugin entry; browser theme registration is intentionally deferred. */
export function apply(): void {}
