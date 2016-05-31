/**
 * Created by zhangran on 16/5/31.
 */
import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/index.js',
  format: 'umd',
  plugins: [ babel() ],
  moduleName: 'MY',
  dest: 'dist/bundle.js'
}