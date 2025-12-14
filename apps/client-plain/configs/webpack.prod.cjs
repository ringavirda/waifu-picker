const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const webpack = require("webpack");
const { merge } = require("webpack-merge");

const commonConfig = require("./webpack.common.cjs");
const outputPath = path.resolve(__dirname, "..", "dist");

const prodConfig = {
  mode: "production",
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  output: {
    path: path.resolve(outputPath, "assets"),
    filename: "[name].[contenthash].bundle.js",
    chunkFilename: "[name].[contenthash].bundle.js",
    clean: true,
    crossOriginLoading: "use-credentials",
    publicPath: "/waifu/",
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(
        process.env.NODE_ENV || "production",
      ),
      "process.env.API_URL": JSON.stringify(
        "https://felled-stars.org/waifu/api",
      ),
    }),
  ],
};

module.exports = merge(commonConfig, prodConfig);
