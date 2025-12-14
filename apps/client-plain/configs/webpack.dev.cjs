const path = require("path");
const webpack = require("webpack");
const { merge } = require("webpack-merge");

const commonConfig = require("./webpack.common.cjs");
const outputPath = path.resolve(__dirname, "..", "dist");

const devConfig = {
  mode: "development",
  devtool: "source-map",
  output: {
    path: path.resolve(outputPath, "assets"),
    filename: "[name].[hash].bundle.js",
    chunkFilename: "[name].[hash].bundle.js",
    clean: true,
  },
  devServer: {
    static: {
      directory: outputPath,
    },
    historyApiFallback: true,
    compress: true,
    port: 4200,
    hot: true,
    devMiddleware: {
      writeToDisk: true,
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(
        process.env.NODE_ENV || "development",
      ),
      "process.env.API_URL": JSON.stringify("http://localhost:5000/api"),
    }),
  ],
};

module.exports = merge(commonConfig, devConfig);
