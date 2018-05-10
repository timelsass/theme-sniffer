const path = require( 'path' );

const webpack = require( 'webpack' );
const CleanWebpackPlugin = require( 'clean-webpack-plugin' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const UglifyJsPlugin = require( 'uglifyjs-webpack-plugin' );

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
			exclude: /node_modules/,
			use: 'babel-loader'
		},
		{
			test: /\.json$/,
			use: 'json-loader'
		},
		{
			test: /\.scss$/,
			exclude: /node_modules/,
			use: [
				MiniCssExtractPlugin.loader,
				'css-loader', 'sass-loader'
			]
		}
	]
};

const allPlugins = [
	new CleanWebpackPlugin([ pluginPublicPath ]),
	new MiniCssExtractPlugin({
		filename: outputCss
	}),
	new webpack.optimize.ModuleConcatenationPlugin(),
	new webpack.DefinePlugin({
		'process.env': {
			NODE_ENV: JSON.stringify( process.env.NODE_ENV || 'development' )
		}
	})
];

if ( ! DEV ) {
	allPlugins.push(
		new UglifyJsPlugin({
			cache: true,
			parallel: true,
			sourceMap: true,
			uglifyOptions: {
				output: {
					comments: false
				},
				compress: {
					warnings: false,
					drop_console: true // eslint-disable-line camelcase
				}
			}
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
