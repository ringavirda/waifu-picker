const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const sourcePath = path.resolve(__dirname, "..", "src");
const entryPath = path.resolve(sourcePath, "index.tsx");

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
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-env",
                ["@babel/preset-react", { runtime: "automatic" }],
              ],
              plugins: [
                ["@babel/plugin-proposal-decorators", { version: "2023-11" }],
              ],
            },
          },
          "ts-loader",
        ],
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
    extensions: [".ts", ".tsx", "..."],
    alias: {
      "@": sourcePath,
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: path.resolve(__dirname, "../public", "index.html"),
      favicon: path.resolve(__dirname, "../public", "favicon.ico"),
    }),
    new MiniCssExtractPlugin({ filename: "styles.[name].[hash].bundle.css" }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "..", "public"),
          to: ".",
          noErrorOnMissing: true,
          globOptions: {
            ignore: ["**/index.html", "**/favicon.ico"],
          },
        },
      ],
    }),
  ],
};

module.exports = commonConfig;
