const path = require("path");
const { merge } = require("webpack-merge");
const TerserPlugin = require("terser-webpack-plugin");

const commonConfig = require("./webpack.common.cjs");
const outputPath = path.resolve(__dirname, "../../..", "dist");

const prodConfig = {
  mode: "production",
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  output: {
    path: outputPath,
    filename: "[name].bundle.js",
    chunkFilename: "[name].bundle.js",
    clean: true,
  },
  externals: [nodeExternals(), { sharp: "commonjs sharp" }],
};

module.exports = merge(commonConfig, prodConfig);
