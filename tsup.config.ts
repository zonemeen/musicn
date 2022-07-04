import { defineConfig } from 'tsup'

export default defineConfig({
  dts: true,
  clean: true,
  minify: true,
  splitting: true,
  outDir: 'dist',
  format: ['esm'],
  entry: ['src/index.ts'],
  noExternal: ['pretty-bytes', 'mem'],
})
