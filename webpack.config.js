const path = require('path')
const { merge } = require('webpack-merge')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")
const TerserPlugin = require('terser-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const commonConfig = {
    entry: {
        base: './src/js/index.js',
        home: './src/js/home/index.js',
        landing: './src/js/landing/index.js',
        profile: './src/js/profile/index.js',
        projects: './src/js/projects/index.js',
        register: './src/js/register/index.js',
        login: './src/js/login/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'todo', 'static', 'dist'),
        publicPath: '/static/dist/',
        filename: 'js/[name].bundle.js',
        chunkFilename: 'js/[name].bundle.js',
        compareBeforeEmit: true
    },
    module: {
        rules: [
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'img/[name]-[contenthash][ext]'
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name]-[contenthash][ext]'
                }
            }
        ]
    }
}

const devConfig = {
    mode: 'development',
    watch: true,
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
        ]
    },
}

const prodConfig = {
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
            },
        ]
    },
    optimization: {
        minimizer: [new CssMinimizerPlugin(), new TerserPlugin()]
    },
    plugins: [new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: [
            '**/*',
            '!logo/**'
        ]
    }), new MiniCssExtractPlugin({
        filename: 'css/style.css',
    })]
}

module.exports = (env, args) => {
    switch (args.mode) {
        case 'development':
            return merge(commonConfig, devConfig)
        case 'production':
            return merge(commonConfig, prodConfig)
        default:
            throw new Error('No matching configuration was found!')
    }
};
