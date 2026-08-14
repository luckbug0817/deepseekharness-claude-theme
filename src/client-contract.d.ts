/** Public client contract published by dsh-client-ui-theme. */
declare module '@deepseek-ai/dsh-client-ui-theme/client' {
  interface ThemeDefinition {
    id: string
    colorScheme: 'light' | 'dark'
    tokens: Record<string, string>
  }
  interface ThemeRuntime { register(definition: ThemeDefinition): () => void }
}

declare module '*.module.css' { const css: Record<string, string>; export default css }
