const path = require('path');

const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const DEV = process.env.NODE_ENV !== 'production';

const appPath = `${path.resolve(__dirname)}`;

// Entry
const pluginPath = '/assets';
const pluginFullPath = `${appPath}${pluginPath}`;
const pluginEntry = `${pluginFullPath}/dev/application.js`;
const pluginPublicPath = `${pluginFullPath}/build`;

// Outputs
const outputJs = 'scripts/[name].js';
const outputCss = 'styles/[name].css';

const allModules = {
  rules: [
    {
      test: /\.(js|jsx)$/,
      use: 'babel-loader',
      exclude: /node_modules/
    },
    {
      test: /\.json$/,
      use: 'json-loader'
    },
    {
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader']
      })
    }
  ]
};

const allPlugins = [
  new CleanWebpackPlugin([pluginPublicPath]),
  new ExtractTextPlugin(outputCss),
  new webpack.optimize.ModuleConcatenationPlugin(),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
    }
  })
];

if (!DEV) {
  allPlugins.push(
    new UglifyJSPlugin({
      uglifyOptions: {
        output: {
          comments: false,
          beautify: false
        },
        sourceMap: true
      }
    })
  );
}

module.exports = [
  {
    devServer: {
      outputPath: path.join(__dirname, 'build')
    },
    entry: {
      application: [pluginEntry]
    },
    output: {
      path: pluginPublicPath,
      publicPath: '',
      filename: outputJs
    },

    module: allModules,

    plugins: allPlugins
  }
];
