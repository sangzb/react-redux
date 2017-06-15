'use strict';

let webpack = require('webpack');
let path = require('path');
let os = require('os');
let AssetsPlugin = require('assets-webpack-plugin');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let qiniuPlugin = require('../webpack-qiniu-plugin');
let autoprefixer = require('autoprefixer');

let NODE_ENV = process.env.NODE_ENV || 'development';

let host;
let ifaces = os.networkInterfaces();
(ifaces.en0 || []).forEach(function(iface) {
  if (iface.family === 'IPv4') {
    host = iface.address || '127.0.0.1';
  }
});

host = host || '127.0.0.1';

let plugins = [
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
    hash: false
  }),
  new AssetsPlugin({
    path: path.join(__dirname),
    filename: 'assets.json',
    fullPath: false
  })
];

let publicPath = qiniuPlugin.publicPath('me');

let babelLoader = {
  loader: 'babel-loader',
  options: {
    cacheDirectory: true,
    presets: ['es2015', 'react']
  }
};

let rules = [];

// 生产/预发布环境
if (NODE_ENV !== 'development') {
  rules.push({
    test: /\.js|jsx$/,
    use: babelLoader,
    exclude: /(node_modules|bower_components)/
  });

  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      },
      mangle: {
        except: ['$super', '$', 'exports', 'require']
      }
    }),
    new webpack.NoErrorsPlugin(),

    // 上传至七牛
    qiniuPlugin('me')
  );
} else {
  // vendor.unshift('webpack/hot/only-dev-server');
  // vendor.unshift('webpack-dev-server/client?http://0.0.0.0:2992');
  plugins.push(new webpack.HotModuleReplacementPlugin());
  // 开发环境
  publicPath = '/';

  //preLoader
  rules.push(
    {
      test: /\.js|jsx$/,
      include: pathToRegExp(path.join(__dirname, 'app')),
      use: [
        {
          loader: 'eslint-loader'
        },
        babelLoader
      ],
      enforce: 'pre',
      exclude: /node_modules/
    }
  );

  rules.push(
    {
      test: /\.js|jsx$/,
      use: [
        {
          loader: 'react-hot-loader'
        },
        babelLoader
      ],
      exclude: /(node_modules|bower_components)/
    }
  );
}

let otherRules = [
  {
    test: /\.json$/,
    use: {
      loader: 'json-loader'
    }
  },
  {
    test: /\.css$/,
    use: [
      {
        loader: 'style-loader'
      },
      {
        loader: 'css-loader'
      },
      {
        loader: 'resolve-url-loader'
      }
    ]
  },
  {
    test: /\.s[c|a]ss$/,
    use: [
      {
        loader: 'style-loader'
      },
      {
        loader: 'css-loader'
      },
      {
        loader: 'postcss-loader',
        options: {
          plugins: function() {
            return [autoprefixer({ remove: false, browsers: ['> 1%'] })];
          }
        }
      },
      {
        loader: 'resolve-url-loader'
      },
      {
        loader: 'sass-loader'
      }
    ]
  },
  {
    test: /\.png|jpg|gif$/,
    use: {
      loader: 'url-loader',
      options: {
        prefix: 'img/',
        limit: 5000
      }
    }
  },
  {
    test: /\.(woff|svg|ttf|eot)([\?]?.*)$/,
    use: {
      loader: 'file-loader' ,
      options: {
        name: '[name].[ext]'
      }
    }
  },
  // 暴露部分插件为全局
  {
    test: /jquery\.js$/,
    use: [
      {
        loader: 'expose-loader',
        options: 'jQuery'
      },
      {
        loader: 'expose-loader',
        options: '$'
      }
    ]
  }
];

rules = rules.concat(otherRules);

process.traceDeprecation = true;
process.noDeprecation = true;

module.exports = {
  devtool: NODE_ENV === 'development' ? 'eval' : undefined,
  context: __dirname,
  entry: {
    // 公共
    vendor: [
      'normalize-css',
      'animate.css'
    ],
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
    rules
  },
  resolveLoader: {
    modules: [path.join(__dirname, 'node_modules')]
  },
  resolve: {
    modules: [path.join(__dirname, 'app'), 'node_modules'],
    extensions: ['.js', '.jsx', '.coffee', '.html', '.css', '.scss', '.sass']
  },
  plugins: plugins,
  devServer: {
    publicPath: publicPath,
    hot: true,
    inline: true,
    proxy: {
      '/wechat/discussion/api/': {
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
