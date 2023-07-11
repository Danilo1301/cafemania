const path = require('path');
var WebpackObfuscator = require('webpack-obfuscator');

module.exports = {
    entry: './src/client/index.ts',
    plugins: [
        //new WebpackObfuscator({rotateStringArray: true, reservedStrings: [ '\s*' ]}, [])
    ],
    output: {
        filename: 'game.js',
        path: path.resolve(__dirname, '..', 'public')
    },
    resolve: {
        extensions: [ '.ts', '.tsx', '.js' ],
        alias: {
          //'@cafemania': path.join(__dirname, 'src')
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            /*
            {
                enforce: 'post',
                use: {
                    loader: WebpackObfuscator.loader,
                    options: {
                        reservedStrings: [ '\s*' ],
                        rotateStringArray: true
                    }
                }
            }
            */
        ],
    },
    devtool: 'source-map',
    mode: 'development'
}