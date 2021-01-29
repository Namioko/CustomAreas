const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    watch: true,
    entry: './src/index.js',
    output: {
        filename: './dist/bundle.js',
        path: path.resolve(__dirname, '.'),
    },
    optimization: {
        minimize: false
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-proposal-class-properties']
                    }
                }
            }
        ],
    },
    // plugins: [
    //     new webpack.ProvidePlugin({
    //         $: "jquery/dist/jquery.min.js",
    //         jQuery: "jquery/dist/jquery.min.js",
    //         "window.jQuery": "jquery/dist/jquery.min.js"
    //     }),
    //     new CopyPlugin({
    //         patterns: [
    //             //design
    //             { from: 'external/js/custom-question.js', to: 'design/custom-question.js' },
    //             { from: 'external/js/design-page-components.js', to: 'design/design-page-components.js' },
    //             { from: 'external/css/design-page-components.css', to: 'design/design-page-components.css' },
    //             { from: 'external/css/jquery.selectareas.css', to: 'design/jquery.selectareas.css' },
    //             { from: 'external/css/bt-delete.png', to: 'design/bt-delete.png' },
    //             { from: 'external/css/outline.gif', to: 'design/outline.gif' },
    //             { from: 'external/css/design-styles.css', to: 'design/styles.css' },
    //             { from: 'external/design-index.html', to: 'design/index.html' },
    //
    //             //runtime
    //             { from: 'external/js/component.js', to: 'runtime/component.js' },
    //             { from: 'external/css/jBox.all.min.css', to: 'runtime/jBox.all.min.css' },
    //             { from: 'external/css/jquery.selectareas.css', to: 'runtime/jquery.selectareas.css' },
    //             { from: 'external/css/bt-delete.png', to: 'runtime/bt-delete.png' },
    //             { from: 'external/css/outline.gif', to: 'runtime/outline.gif' },
    //             { from: 'external/css/runtime-styles.css', to: 'runtime/styles.css' }
    //         ]
    //     })
    // ]
};



