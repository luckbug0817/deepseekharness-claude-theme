/**
 * Minimal public ThemeRuntime contract verified against the current Harness
 * source. It deliberately avoids a package import: an external static client
 * receives this service from the compatible Web profile through ctx injection.
 */
export interface ThemeDefinition {
  id: string
  colorScheme: 'light' | 'dark'
  tokens: Record<string, string>
}

export interface ThemeRuntime {
  register(definition: ThemeDefinition): () => void
}
