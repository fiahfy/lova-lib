import fs from 'fs'
import baseConfig from './base.babel'

const nodeModules = fs.readdirSync('node_modules')
  .filter(dir => '.bin' !== dir)

const config = {
  target: 'node',
  entry: './src/cli.js',
  output: {
    path: './public/assets/',
    publicPath: '/assets/',
    filename: '../../cli.js',
    libraryTarget: 'commonjs2'
  },
  externals: nodeModules
}

export default Object.assign({}, baseConfig, config)
