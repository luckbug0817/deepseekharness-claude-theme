import { defineConfig } from 'tsdown'
import { readFile } from 'node:fs/promises'
import { basename, dirname, resolve } from 'node:path'
import { transform } from 'lightningcss'

const CSS_PREFIX = '\0claude-theme-css:'
const CSS_SUFFIX = '.mjs'

export default defineConfig([
  {
    entry: { index: 'src/index.ts' },
    format: 'esm',
    outDir: 'lib',
    fixedExtension: false,
    dts: true,
    clean: true,
  },
  {
    entry: { client: 'src/client/index.ts' },
    format: 'cjs',
    platform: 'browser',
    outDir: 'lib',
    dts: false,
    clean: false,
    plugins: [{
      name: 'claude-theme-css-module',
      resolveId(source, importer) {
        if (!source.endsWith('.module.css') || importer === undefined) return null
        return `${CSS_PREFIX}${resolve(dirname(importer), source)}${CSS_SUFFIX}`
      },
      async load(id) {
        if (!id.startsWith(CSS_PREFIX)) return null
        const filename = id.slice(CSS_PREFIX.length, -CSS_SUFFIX.length)
        this.addWatchFile(filename)
        const { code, exports } = transform({ filename, code: await readFile(filename), cssModules: true, minify: true })
        const classes = Object.fromEntries(
          Object.entries(exports ?? {}).map(([name, value]) => [name, value.name]),
        )
        const tagId = `deepseek-claude-web-theme/${basename(filename)}`
        return [
          `const css = ${JSON.stringify(code.toString())};`,
          `const tagId = ${JSON.stringify(tagId)};`,
          "if (typeof document !== 'undefined' && document.querySelector('style[data-plugin-css=' + JSON.stringify(tagId) + ']') === null) {",
          "  const tag = document.createElement('style');",
          "  tag.dataset.plugin = 'deepseek-claude-web-theme';",
          '  tag.dataset.pluginCss = tagId;',
          '  tag.textContent = css;',
          '  document.head.appendChild(tag);',
          '}',
          `export default ${JSON.stringify(classes)};`,
        ].join('\n')
      },
    }],
    outputOptions: {
      entryFileNames: 'client.js',
      banner: 'window.__ModuleLoader__.load({ id: "deepseek-claude-web-theme", factory: (require) => {',
      footer: 'return module.exports; } });',
      intro: 'var module = { exports: {} }; var exports = module.exports;',
    },
  },
])
