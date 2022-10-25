import fs from 'fs'
import { defineConfig } from 'tsup'

const removeSomeCodePlugin = {
  name: 'removeSomeCodePlugin',
  setup(build: any) {
    build.onLoad({ filter: /command.ts/ }, async (args: any) => {
      const sourceCode = await fs.promises.readFile(args.path, 'utf8')
      return {
        contents: sourceCode.split('process.stdout.write(JSON.stringify(content))').join(''),
      }
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
