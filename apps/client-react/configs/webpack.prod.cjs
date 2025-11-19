const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const { merge } = require("webpack-merge");

const commonConfig = require("./webpack.common.cjs");
const outputPath = path.resolve(__dirname, "../../..", "dist/public");

const prodConfig = {
  mode: "production",
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  output: {
    path: outputPath,
    filename: "[name].[hash].bundle.js",
    chunkFilename: "[name].[hash].bundle.js",
  },
};

module.exports = merge(commonConfig, prodConfig);
