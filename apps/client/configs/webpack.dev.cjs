const path = require("path");
const { merge } = require("webpack-merge");
const nodeExternals = require("webpack-node-externals");

const commonConfig = require("./webpack.common.cjs");
const outputPath = path.resolve(__dirname, "..", "dist");

const devConfig = {
  mode: "development",
  devtool: "source-map",
  output: {
    path: outputPath,
    filename: "[name].bundle.js",
    chunkFilename: "[name].bundle.js",
    clean: true,
  },
  // externals: [nodeExternals()],
  devServer: {
    static: {
      directory: outputPath,
    },
    compress: true,
    port: 5500,
  },
};

module.exports = merge(commonConfig, devConfig);
