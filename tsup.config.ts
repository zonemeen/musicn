import fs from 'fs'
import { defineConfig } from 'tsup'
import MagicString from 'magic-string'

const removeSomeCodePlugin = {
  name: 'example',
  setup(build: any) {
    build.onLoad({ filter: /command.ts/ }, async (args: any) => {
      const sourceCode = await fs.promises.readFile(args.path, 'utf8')
      const magicString = new MagicString(sourceCode)
      magicString.update(944, 993, '')
      return { contents: magicString.toString() }
    })
  },
}

export default defineConfig({
  dts: true,
  clean: true,
  minify: true,
  splitting: true,
  outDir: 'dist',
  format: ['esm'],
  entry: ['src/index.ts'],
  noExternal: ['pretty-bytes', 'mem'],
  esbuildPlugins: [removeSomeCodePlugin],
})
