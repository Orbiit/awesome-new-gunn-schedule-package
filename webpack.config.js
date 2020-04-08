const path = require('path')

const production = process.env.NODE_ENV === 'production'

module.exports = {
  entry: './src/index.js',
  mode: production ? 'production' : 'development',
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: `awesome-new-gunn-schedule-package${production ? '.min' : ''}.js`,
    library: 'GunnSchedule',
    libraryTarget: 'umd'
  }
}
