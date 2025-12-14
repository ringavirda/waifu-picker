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
    globalObject: "this",
    clean: true,
  },
  externals: [nodeExternals(), { sharp: "commonjs sharp" }],
};

module.exports = merge(commonConfig, devConfig);
