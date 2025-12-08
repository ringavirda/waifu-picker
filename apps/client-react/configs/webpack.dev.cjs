const path = require("path");
const { merge } = require("webpack-merge");
const commonConfig = require("./webpack.common.cjs");
const outputPath = path.resolve(__dirname, "..", "dist");

const devConfig = {
  mode: "development",
  devtool: "source-map",
  output: {
    path: outputPath,
    filename: "[name].[contenthash].bundle.js",
    chunkFilename: "[name].[contenthash].bundle.js",
    clean: true,
  },
  devServer: {
    static: {
      directory: outputPath,
    },
    compress: true,
    port: 5500,
    historyApiFallback: true,
    hot: true,
  },
};

module.exports = merge(commonConfig, devConfig);
