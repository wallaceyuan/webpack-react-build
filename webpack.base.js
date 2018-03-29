var path = require('path');
var webpack = require('webpack');
var ExtractTextWebpackPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');


let cssExtract = new ExtractTextWebpackPlugin({
    filename: 'css.css',
    allChunks: true
});
let sassExtract = new ExtractTextWebpackPlugin('sass.css')
let lessExtract = new ExtractTextWebpackPlugin('less.css')

module.exports = {
    entry: [
        'react-hot-loader/patch', // 激活HMR
        './src/index.js'
    ],
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'bundle.[hash:8].js',
        publicPath: ''
    },
    resolve: {
        //引入模块的时候，可以不用扩展名
        extensions: [".js", ".less", ".json"],
        alias: {//别名
            "bootstrap": "bootstrap/dist/css/bootstrap.css"
        },
        modules: [path.resolve(__dirname, 'node_modules')]
    },
/*    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
        // 提出ant design的公共资源
        //'antd': 'antd',
    },*/
    devtool: 'source-map',
    devServer: {
        contentBase:path.resolve(__dirname,'dist'),
        publicPath: '/',
        port: 8080,
        hot:true,
        compress:true,
        historyApiFallback: true,
        inline: true
    },
    watch: false, //只有在开启监听模式时，watchOptions才有意义
    watchOptions: {
        ignored: /node_modules/,
        aggregateTimeout: 300, //监听到变化发生后等300ms再去执行动作，防止文件更新太快导致编译频率太高
        poll: 1000 //通过不停的询问文件是否改变来判断文件是否发生变化，默认每秒询问1000次
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    chunks: "initial",
                    minChunks: 2,
                    maxInitialRequests: 5, // The default limit is too small to showcase the effect
                    minSize: 0 // This is example is too small to create commons chunks
                },
                vendor: {
                    test: /node_modules/,
                    chunks: "initial",
                    name: "vendor",
                    priority: 10,
                    enforce: true
                }
            }
        }
    },
    module: {
        rules:[
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader:'babel-loader',
                    options: {
                        presets: ['env','es2015', 'react'],
                    }
                },
                include:path.join(__dirname,'./src'),
                exclude:/node_modules/
            },
            {
                test: /\.css$/,
                use: cssExtract.extract({
                    fallback: "style-loader",
                    use: ['css-loader?minimize','postcss-loader'],
                    publicPath: "/dist"
                }),
                include:path.join(__dirname,'./src'),
                exclude:/node_modules/
            },
            {
                test: /\.scss$/,
                include: __dirname + /src/,
                use: sassExtract.extract({
                    fallback: "style-loader",
                    use: ["css-loader?minimize","sass-loader"],
                    publicPath: "/dist"
                }),
                include:path.join(__dirname,'./src'),
                exclude:/node_modules/
            },
            {
                test: /\.less$/,
                loader: lessExtract.extract({
                    use: ["css-loader?minimize", "less-loader"]
                }),
                include:path.join(__dirname,'./src'),
                exclude:/node_modules/
            },
            {
                test: /\.(html|htm)/,
                use: 'html-withimg-loader'
            },
            {
                test: /\.(png|jpg|gif|svg|bmp|eot|woff|woff2|ttf)/,
                use: {
                    loader:'url-loader',
                    options:{
                        limit: 5 * 1024,
                        //指定拷贝文件的输出目录
                        outputPath: 'images/'
                    }
                }
            }
        ]
    },
    plugins: [
        //定义环境变量
        new webpack.DefinePlugin({
            __development__: JSON.stringify(process.env.NODE_ENV)
        }),
        new CleanWebpackPlugin(['dist']),
        cssExtract,
        lessExtract,
        sassExtract,
        new HtmlWebpackPlugin({
            title: 'React Biolerplate by YuanYuan',
            template: './src/index.html',
            filename: `index.html`,
            hash: true
        }),
/*        new webpack.optimize.CommonsChunkPlugin({
            name: 'common' // 指定公共 bundle 的名称。
    +     })*/
        new webpack.HotModuleReplacementPlugin(), // 热替换插件
        new webpack.NamedModulesPlugin() // 执行热替换时打印模块名字
    ]
};