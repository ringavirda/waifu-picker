const path = require("path");
const nodeExternals = require("webpack-node-externals");

const entryPath = path.resolve(__dirname, "../src", "server.ts");

const commonConfig = {
  target: "node",
  externalsPresets: { node: true },
  externals: [
    {
      sharp: "commonjs sharp",
    },
  ],
  entry: {
    main: entryPath,
  },
  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      cacheGroups: {
        vendor: {
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
            loader: "ts-loader",
            options: {
              configFile: path.resolve(__dirname, "..", "tsconfig.json"),
            },
          },
        ],
      },
      {
        test: /\.node$/,
        use: "node-loader",
      },
      {
        test: /\.(so|dll|dylib)$/,
        type: "asset/resource",
        generator: {
          filename: "sharp_libs/[name][ext]",
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts", "..."],
  },
};

module.exports = commonConfig;
