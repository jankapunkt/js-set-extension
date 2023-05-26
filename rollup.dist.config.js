import { babel, getBabelOutputPlugin } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'

export default [{
  input: 'src/index.js',
  output: [
    {
      file: 'dist/index.js',
      format: 'es'
    },
    {
      file: 'dist/index.es5.js',
      format: 'es',
      plugins: [getBabelOutputPlugin({ presets: ['@babel/preset-env'] })]
    },
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      plugins: [getBabelOutputPlugin({ presets: ['@babel/preset-env'] })]
    }
  ]
}, {
  input: 'src/index.js',
  output: {
    file: 'dist/index.iife.js',
    format: 'iife',
    name: 'SetExtension'
  },
  plugins: [
    commonjs(),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled'
    })
  ]
}]