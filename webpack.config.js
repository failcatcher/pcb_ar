const path = require('path');
const webpack = require('webpack');

module.exports = (env) => {
  return {
    entry: './src/index.js',
    devtool: 'inline-source-map',
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'dist')
    },
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      compress: true,
      port: 8080
    },
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        '@': path.resolve('src')
      }
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader'
          }
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: false
              }
            }
          ]
        },
        {
          test: /\.(png|svg|jpg)$/,
          use: ['file-loader']
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        BASE_DIR: JSON.stringify(env.NODE_ENV == 'local' ? '' : '/pcb_ar/dist')
      })
    ]
  };
};
