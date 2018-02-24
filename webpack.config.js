const path = require( 'path' );

const webpack = require( 'webpack' );
const CleanWebpackPlugin = require( 'clean-webpack-plugin' );
const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );
const DEV = process.env.NODE_ENV !== 'production';

const appPath = __dirname;

// Entry
const pluginPath = '/src/assets';
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
			test: /\.scss$/,
			use: ExtractTextPlugin.extract({
				fallback: 'style-loader',
				use: [ 'css-loader', 'sass-loader' ]
			})
		}
	]
};

const allPlugins = [
	new CleanWebpackPlugin([ pluginPublicPath ]),
	new ExtractTextPlugin( outputCss ),
	new webpack.optimize.ModuleConcatenationPlugin(),
	new webpack.DefinePlugin({
		'process.env': {
			NODE_ENV: JSON.stringify( process.env.NODE_ENV || 'development' )
		}
	})
];

if ( ! DEV ) {
	allPlugins.push(
		new webpack.optimize.UglifyJsPlugin({
			output: {
				comments: false
			},
			compress: {
				warnings: false,
				drop_console: true // eslint-disable-line camelcase
			},
			sourceMap: true
		})
	);
}

module.exports = [
	{
		devServer: {
			outputPath: path.join( __dirname, 'build' )
		},
		entry: {
			application: [ pluginEntry ]
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
