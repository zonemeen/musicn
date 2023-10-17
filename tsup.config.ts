import { readFile } from 'node:fs/promises'
import { defineConfig } from 'tsup'

const removeSomeCodePlugin = {
  name: 'removeSomeCodePlugin',
  // @ts-ignore
  setup(build) {
    build.onLoad({ filter: /command.ts/ }, async ({ path }: { path: string }) => {
      const sourceCode = await readFile(path, 'utf8')
      return {
        contents: sourceCode.split('process.stdout.write(JSON.stringify(content))').join(''),
      }
    })
  },
}

export default defineConfig({
  clean: true,
  minify: true,
  splitting: true,
  outDir: 'dist',
  format: ['esm'],
  entry: ['src/index.ts'],
  noExternal: ['pretty-bytes', 'mem'],
  esbuildPlugins: [removeSomeCodePlugin],
})
