module.exports = {
	configureWebpack:{
	 resolve:{
	 	extensions:['.js','.css','.vue','.json'],//在导入以上文件时后缀名都可简写不加
	 	alias:{
					 'assets':'@/assets',
					 'components':'@/components',
				   'views':'@/views'
					 
	 	},
	 }
	},
  devServer:{
  	proxy:{
  		'/api':{
  			target:'http://localhost:8080',
  			pathRewrite:{'^/api':''}
  		}
  	},
		//跨域配置
  },
	//关闭语法检查
	lintOnSave: false,
	//解决项目打包，找不到资源的问题
	publicPath:"./"
}
//可在此修改配置文件,配置完成后自动与配置文件融合
