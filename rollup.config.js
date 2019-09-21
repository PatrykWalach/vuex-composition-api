import pkg from './package.json'
import { terser } from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript2'
export default {
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
    },
    {
      file: pkg.module,
      format: 'es',
    },
  ],
  plugins: [
    typescript({
      typescript: require('typescript'),
    }),
    terser(),
  ],
}
