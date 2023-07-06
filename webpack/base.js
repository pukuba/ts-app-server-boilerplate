const path = require('path');
const PnpWebpackPlugin = require('pnp-webpack-plugin');
const { WebpackPnpExternals } = require('webpack-pnp-externals');

const dev = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: {
    index: path.resolve('./src/index.ts'),
  },
  output: {
    path: path.resolve('./dist'),
    filename: '[name].js',
    devtoolModuleFilenameTemplate: '../[resource-path]',
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
      {
        test: /\.ts$/,
        use: {
          loader: require.resolve('babel-loader'),
          options: {
            cacheDirectory: true,
            presets: [
              '@babel/typescript',
              ['@babel/env', { targets: { node: 16 } }],
            ],
            plugins: ['@babel/plugin-proposal-class-properties', 'lodash'],
          },
        },
      },
      {
        test: /\.graphql$/,
        loader: require.resolve('raw-loader'),
      },
    ],
  },
  resolve: {
    plugins: [PnpWebpackPlugin],
    extensions: ['.js', '.mjs', '.ts'],
    alias: {
      '~': path.resolve('./src'),
      '@graphql': path.resolve('./src/graphql'),
    },
  },
  resolveLoader: {
    plugins: [PnpWebpackPlugin.moduleLoader(module)],
  },
  devtool: dev ? 'cheap-module-source-map' : 'source-map',
  target: 'node',
  externals: [WebpackPnpExternals()],
  stats: 'errors-only',
  optimization: {
    minimize: false,
  },
  plugins: []
};
