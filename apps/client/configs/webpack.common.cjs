const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const sourcePath = path.resolve(__dirname, "..", "src");
const entryPath = path.resolve(sourcePath, "index.ts");

const commonConfig = {
  target: "web",
  entry: {
    main: entryPath,
  },
  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
              plugins: [
                ["@babel/plugin-proposal-decorators", { version: "2023-11" }],
              ],
            },
          },
          "ts-loader",
        ],
      },
      {
        test: /\.html$/,
        use: ["raw-loader"],
        exclude: /index.html/,
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              sassOptions: {
                loadPaths: [sourcePath],
              },
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "[name].[ext]",
            outputPath: "assets",
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts", "..."],
    alias: {
      "@": sourcePath,
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: path.resolve(sourcePath, "index.html"),
      favicon: path.resolve(sourcePath, "favicon.ico"),
    }),
    new MiniCssExtractPlugin({ filename: "[name].[hash].bundle.css" }),
  ],
};

module.exports = commonConfig;
