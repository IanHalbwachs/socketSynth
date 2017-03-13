module.exports = {
  entry: {
    performer: './app/performer.js',
    conductor: './app/conductor.js',
    test: './app/test.js'
  },
  output: {
    path: './app',
    filename: '[name].bundle.js'
  }
}
