const path = require('path');

const ROOT_DIR = '.';

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: {
        index: path.resolve(__dirname, ROOT_DIR, 'src/main.tsx')
    },
    output: {
        path: path.resolve(__dirname, ROOT_DIR, 'dist'),
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        modules: [
            path.resolve(__dirname, ROOT_DIR, 'node_modules')
        ]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            silent: true
                        }
                    }
                ]
            }
        ]
    },
    optimization: {
        concatenateModules: true
    }
};
