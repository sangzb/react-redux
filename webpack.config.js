var webpack = require('webpack');
var path = require('path');
var os = require('os');
var AssetsPlugin = require('assets-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var NODE_ENV = process.env.NODE_ENV || 'development';

var host;
var ifaces = os.networkInterfaces();
(ifaces.en0 || []).forEach(function(iface) {
  if (iface.family === 'IPv4') {
    host = iface.address || '127.0.0.1';
  }
});

host = host || '127.0.0.1';

var plugins = [
  new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 50 }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    filename: 'vendor.js'
  }),
  new webpack.DefinePlugin({
    'require.specified': 'require.resolve'
  }),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(NODE_ENV)
    }
  }),
  new HtmlWebpackPlugin({
    filename: '../index.html',
    template: 'app/index.ejs',
    hash: true
  }),
  new AssetsPlugin({
    path: path.join(__dirname),
    filename: 'assets.json',
    fullPath: false
  })
];

var publicPath = '/wechat/discussion/assets/';

var preLoaders = [];
var babelLoader = 'babel?cacheDirectory=true&presets[]=es2015&presets[]=react';

// 生产/预发布环境
if (NODE_ENV !== 'development') {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      },
      mangle: {
        except: ['$super', '$', 'exports', 'require']
      }
    }),
    new webpack.NoErrorsPlugin()
  );
} else {
  // vendor.unshift('webpack/hot/only-dev-server');
  // vendor.unshift('webpack-dev-server/client?http://0.0.0.0:2992');
  plugins.push(new webpack.HotModuleReplacementPlugin());
  // 开发环境
  publicPath = `http://${host}:2995/`;

  preLoaders = [
    {
      test: /\.js|jsx$/,
      include: pathToRegExp(path.join(__dirname, 'app')),
      loaders: ['eslint-loader', babelLoader]
    }
  ];
}

module.exports = {
  devtool: NODE_ENV === 'development' ? 'eval' : undefined,
  context: __dirname,
  entry: {
    // 公共
    vendor: [
      'normalize-css',
      'animate.css'
    ],

    // 垫片
    // shivs: ['html5shiv'],

    // 应用
    app: ['app.jsx']
  },
  output: {
    path: path.join(__dirname, 'dist/assets'),
    publicPath: publicPath,
    filename: '[name].bundle.js'
  },
  recordsOutputPath: path.join(__dirname, 'records.json'),
  module: {
    loaders: [
      {
        test: /\.js|jsx$/,
        loaders: NODE_ENV === 'development' ? ['react-hot-loader', babelLoader] : [babelLoader],
        exclude: /(node_modules|bower_components)/
      },
      { test: /\.json$/,   loader: 'json-loader' },
      { test: /\.css$/,    loader: 'style-loader!css-loader!resolve-url' },
      { test: /\.scss$/,   loader: 'style-loader!css-loader!autoprefixer-loader?{remove: false, browsers: ["> 1%"]}!resolve-url!sass-loader?sourceMap' },
      { test: /\.sass$/,   loader: 'style-loader!css-loader!autoprefixer-loader?{remove: false, browsers: ["> 1%"]}!resolve-url!sass-loader?sourceMap' },
      { test: /\.png$/,    loader: 'url-loader?prefix=img/&limit=5000' },
      { test: /\.jpg$/,    loader: 'url-loader?prefix=img/&limit=5000' },
      { test: /\.gif$/,    loader: 'url-loader?prefix=img/&limit=5000' },
      { test: /\.(woff|svg|ttf|eot)([\?]?.*)$/, loader: 'file-loader?name=[name].[ext]' },

      // 暴露部分插件为全局
      { test: /jquery\.js$/, loader: 'expose?$' },
      { test: /jquery\.js$/, loader: 'expose?jQuery' },
      { test: /chartist\.js$/, loader: 'expose?Chartist' },
      { test: /waves\.js$/, loader: 'expose?Waves' }
    ],
    preLoaders: preLoaders
  },
  resolveLoader: {
    root: path.join(__dirname, 'node_modules')
  },
  resolve: {
    root: [path.join(__dirname, 'app')],
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js', '.jsx', '.coffee', '.html', '.css', '.scss', '.sass']
  },
  plugins: plugins,
  fakeUpdateVersion: 0,
  devServer: {
    publicPath: publicPath,
    hot: true,
    inline: true,
    proxy: {
      '/wechat/discussion/api/*': {
        target: `http://${host}:3004`,
        secure: false
      }
    },
    historyApiFallback: true,
    stats: {
      colors: true
    }
  }
};

function escapeRegExpString(str) { return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'); }
function pathToRegExp(p) { return new RegExp('^' + escapeRegExpString(p)); }
