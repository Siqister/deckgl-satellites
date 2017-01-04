//run webpack-dev-server --content-base dist

module.exports = {
	entry:'./src/index.js',
	output:{
		path:__dirname+'/dist',
		filename:'bundle.js',
		publicPath:'/assets/'
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
			}
		]
	}
}