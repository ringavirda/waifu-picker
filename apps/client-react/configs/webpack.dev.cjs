const path = require("path");
const { merge } = require("webpack-merge");
const commonConfig = require("./webpack.common.cjs");
const outputPath = path.resolve(__dirname, "..", "dist");

const devConfig = {
  mode: "development",
  devtool: "source-map",
  output: {
    path: outputPath,
    filename: "[name].[hash].bundle.js",
    chunkFilename: "[name].[hash].bundle.js",
    clean: true,
  },
  devServer: {
    static: {
      directory: outputPath,
    },
    compress: true,
    port: 5000,
  },
};

module.exports = merge(commonConfig, devConfig);
