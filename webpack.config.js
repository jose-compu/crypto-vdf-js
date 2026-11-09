const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist/browser'),
    filename: 'vdf.min.js',
    library: 'vdf',
    libraryTarget: 'umd',
    globalObject: 'this',
    umdNamedDefine: true
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      'node:crypto$': require.resolve('crypto-browserify')
    },
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      'node:crypto': require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer')
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser'
    }),
    new webpack.NormalModuleReplacementPlugin(/node:crypto/, require.resolve('crypto-browserify'))
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  optimization: {
    minimize: true
  }
};

