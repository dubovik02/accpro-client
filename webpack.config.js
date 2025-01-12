const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
//const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const isDev = process.env.NODE_ENV === 'development';


module.exports = {

  entry: { main: './src/index.ts' },
  output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[chunkhash].js',
      publicPath: ''
  },

  devtool: 'inline-source-map',

  watch: true,

  //открываем в Firefox
  devServer: {
    open: true,
    static: {
      directory: path.join(__dirname, 'public'),
    },
  },

  //Полифилы
  resolve: {
    fallback: {
      path: require.resolve("path-browserify"),
      stream: require.resolve("stream-browserify"),
      util: require.resolve("util/"),
      os: require.resolve("os-browserify/browser"),
      assert: require.resolve("assert/"),
      constants: require.resolve("constants-browserify"),
      vm: require.resolve("vm-browserify"),
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      crypto: require.resolve("crypto-browserify"),
      fs: false,
      child_process: false,
      worker_threads: false,
    },

    extensions: ['.js', '.ts'],
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: { transpileOnly: true }
      },

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

    ],
    /////////////////////////////////
    // optimization: {
    //   minimizer: [
    //     // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
    //     // `...`,
    //     new CssMinimizerPlugin(),
    //   ],
    // },
    ////////////////////////////////
  },

  plugins: [
    new MiniCssExtractPlugin({filename: 'style.[contenthash].css'}),

    new HtmlWebpackPlugin({
      inject: false, // стили НЕ нужно прописывать внутри тегов
      template: './src/index.html', // откуда брать образец для сравнения с текущим видом проекта
      chunks: ['main'],
      filename: 'index.html', // имя выходного файла, то есть того, что окажется в папке dist после сборки
    }),

    new CssMinimizerPlugin(),

    // new OptimizeCssAssetsPlugin({
    //   assetNameRegExp: /\.css$/g,
    //   cssProcessor: require('cssnano'),
    //   cssProcessorPluginOptions: {
    //     preset: ['default'],
    //   },
    //   canPrint: true
    // }),

    new webpack.DefinePlugin({
      'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),

    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),

  ]
}