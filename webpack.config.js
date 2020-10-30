const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const isDev = process.env.NODE_ENV === 'development';


module.exports = {

  entry: { main: './src/index.js' },
  output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[chunkhash].js',
      publicPath: ''
  },

  //открываем в Firefox
  devServer: {
    open: 'Firefox'
  },

  module: {
    rules: [
      { // тут описываются правила
        test: /\.js$/, // регулярное выражение, которое ищет все js файлы
        use: { loader: "babel-loader" }, // весь JS обрабатывается пакетом babel-loader
        exclude: /node_modules/ // исключает папку node_modules
      },

      {
        test: /\.css$/, // применять это правило только к CSS-файлам
        use: [
          (isDev ? 'style-loader' : {loader: MiniCssExtractPlugin.loader, options: {publicPath: ''}}),
          'css-loader',
          'postcss-loader'
        ] // к этим файлам нужно применить пакеты, которые уже установили
      },

      {
        test: /\.(png|jpg|gif|ico|svg)$/,
        use: [
                'file-loader?name=./images/[name].[ext]', // указали папку, куда складывать изображения
                {
                  loader: 'image-webpack-loader',
                  options: {}
                },
        ]
      },

      {
        test: /\.(eot|ttf|woff|woff2)$/,
        loader: 'file-loader',
        options: {
          name: './vendor/[name].[ext]',
        },
      }

    ]
  },

  plugins: [
    new MiniCssExtractPlugin({filename: 'style.[contenthash].css'}),

    new HtmlWebpackPlugin({
      inject: false, // стили НЕ нужно прописывать внутри тегов
      template: './src/index.html', // откуда брать образец для сравнения с текущим видом проекта
      chunks: ['main'],
      filename: 'index.html', // имя выходного файла, то есть того, что окажется в папке dist после сборки
    }),

    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: ['default'],
      },
      canPrint: true
    }),

    new webpack.DefinePlugin({
      'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ]

}