//run webpack-dev-server --content-base dist
//https://webpack.github.io/docs/configuration.html

module.exports = {
	entry:'./src/index.js',
	output:{
		path:__dirname+'/dist',
		filename:'bundle.js',
		publicPath:'/assets/'
	},
	devtool:"#source-map",
	devServer:{
		contentBase:'./dist'
	},
	module:{
		loaders:[
			{
				test: /\.jsx?$/,
				loader:'babel-loader',
				query:{
					presets:['es2015','react']
				},
				include:__dirname+'/src'
			},
			{test:/\.css$/, loader:"style-loader!css-loader"},
			{ test: /\.woff(\d+)?$/, loader: 'url?prefix=font/&limit=5000&mimetype=application/font-woff' },
         	{ test: /\.ttf$/, loader: 'file?prefix=font/' },
         	{ test: /\.eot$/, loader: 'file?prefix=font/' },
         	{ test: /\.svg$/, loader: 'file?prefix=font/' },
         	{ test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff"},
         	{ test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
		]
	}
}