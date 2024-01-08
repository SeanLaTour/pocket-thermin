const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: "production",
  entry: './src/scripts/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  watch: false,
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'disabled',
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
};

