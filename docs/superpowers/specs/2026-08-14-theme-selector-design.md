# Claude Theme Selector — Design

## Goal

Expose the plugin's registered `claude-sandstone` and `claude-ink` themes as selectable cards in the DeepSeek Harness Web settings, so the themes can be switched without URL parameters or Harness core changes.

## Architecture

The browser plugin declares both `theme` and `slots` injection. After the official `settings.general.item` slot exists, it registers one `Claude Theme` settings row. The row renders two buttons through React, reads `ctx.theme.getTheme()` for the active selection, calls `ctx.theme.setTheme(id)` on click, and subscribes to `theme/change` so its active state stays current. Every registration and subscription is owned by the plugin Fiber and disappears on unload.

## User interface

- Location: Settings → General, below the built-in Appearance row.
- Heading: `Claude Theme` with a concise Chinese subtitle when the Harness UI is Chinese.
- Cards: `Sandstone` / `Ink`, each with a visual swatch and one-line description.
- Selection: the active card has the accent outline and `aria-pressed=true`.
- The controls do not write a separate plugin setting; they use the Harness theme service's existing in-process selection path.

## Dependencies and boundaries

- Use only public, static client-plugin surfaces: `theme`, `slots`, React, and the `settings.general.item` slot.
- Do not replace the built-in Appearance row or modify DeepSeek Harness source.
- Use local CSS and existing semantic `--dsw-alias-*` variables; load no external assets.
- Register the settings row only after the slot provider is available. On missing `theme` or `slots`, the client plugin must park through Cordis injection rather than throw.

## Testing and verification

- Unit tests assert the plugin's `inject` declaration includes `theme` and `slots`.
- Tests assert exactly one settings-row registration, two accessible cards, switching calls `setTheme` with the correct IDs, theme-change updates selection, and unload disposes registration/subscription.
- Run `npm test`, typecheck, build, and `npm pack --dry-run`.
- Reinstall the generated archive in the Mac mini Web Profile; verify both cards are visible, capture one Sandstone and one Ink screenshot, then add those images and a README gallery to GitHub.

## Failure and recovery

- If the target Harness version lacks the settings slot, the client plugin remains parked; no core UI is altered.
- Removing the plugin removes its settings row and leaves built-in themes selectable.
- The README keeps the existing profile uninstall instructions.
