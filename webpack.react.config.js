const webpack = require('webpack')
const path = require('path')

module.exports = {
    entry:{
        react:['react','react-dom','antd']
    },
    output:{
        path:path.resolve(__dirname,'vendor'),
        filename:'[name].dll.js',
        library:'_dll_[name]'
    },
    plugins:[
        new webpack.DllPlugin({
            name:'_dll_[name]',
            path:path.join(__dirname,'vendor','[name].manifest.json')
        })
    ]
}