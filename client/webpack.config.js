const path = require('path');

module.exports = {
  entry: './src/index.js', // Your entry point
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      // Add this rule to handle source maps
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
        exclude: [/node_modules/],
      },
      // Add other rules for handling different file types
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader']
      }
    ]
  },
  // Add other configurations here
  resolve: {
    extensions: ['.js', '.jsx'],
    fallback: {
      console: require.resolve('console-browserify'),
    },
  },
  devtool: 'source-map' // Ensure source maps are generated
};
