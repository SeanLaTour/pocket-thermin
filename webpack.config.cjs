const path = require('path');

module.exports = {
  mode: "production",
  entry: './src/scripts/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  watch: true,
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'disabled',
    }),
  ]
};
