var path = require('path');

module.exports = {
  entry: {
    performer: path.join(__dirname, 'app') + '/performer.js',
    conductor: path.join(__dirname, 'app') + '/conductor.js',
    test: path.join(__dirname, 'app') + '/test.js'
  },
  output: {
    path: path.join(__dirname, 'app'),
    filename: '[name].bundle.js'
  }
}
