const path = require("path");
const webpack = require("webpack");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const HtmlwebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const { resolve } = path;

// html-webpack-plugin : output html
// mini-css-extract-plugin: output css
// clean-webpack-plugin: build(dist)
module.exports = {
  context: resolve(__dirname, "./src"),
  entry: {
    router: "./router.js",
    main: "./main.js",
  },
  output: {
    path: resolve(__dirname, "./dist"),
    filename: "[name].js",
    clean: true,
    publicPath: "/static/",
  },
  plugins: [
    new HtmlwebpackPlugin({
      filename: "index.html",
      template: "index.html",
    }),
    new MiniCssExtractPlugin({
      linkType: false,
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
    new CleanWebpackPlugin({
      cleanAfterEveryBuildPatterns: ["dist"],
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: "static", to: "static" }],
    }),
    new webpack.DefinePlugin({
      "process.env.mode": JSON.stringify(env.mode),
    }),
    new UglifyJSPlugin({
      test: /\.js?$/i,
      keep_classnames: true,
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      reportFilename: "bundle-report.html",
      openAnalyzer: false,
      generateStatsFile: true,
      statsFilename: "bundle-stats.json",
    }),
  ],
  resolve: {
    alias: {
      "@": path.join(__dirname, "src", "src"),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: "/node_modules",
        include: resolve(__dirname, "src"),
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: ["@babel/plugin-transform-runtime"],
          },
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  optimization: {
    minimize: true,
    concatenateModules: true,
    chunkIds: "size",
  },
  mode: "production",
  watch: false,
  devtool: "inline-source-map",
};
