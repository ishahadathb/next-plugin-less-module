const ExtractCssChunks = require("extract-css-chunks-webpack-plugin");
const lessToJs = require("less-vars-to-js");

module.exports = (nextConfig, lessOptions, cssOptions) => ({
  ...nextConfig,
  webpack: (config, options) => {
    const { dev } = options;

    config.module.rules.push({
      test: /\.less$/,
      exclude: /\.module\.less$/,
      use: [
        ExtractCssChunks.loader,
        { loader: "css-loader", options: { importLoaders: 1, ...cssOptions } },
        {
          loader: "less-loader",
          options: { javascriptEnabled: true, ...lessOptions },
        },
      ],
    });

    config.plugins.push(
      new ExtractCssChunks({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        // eslint-disable-next-line prettier/prettier
        filename: dev
          ? "static/chunks/[name].css"
          : "static/chunks/[name].[contenthash:8].css",
        chunkFilename: dev
          ? "static/chunks/[name].chunk.css"
          : "static/chunks/[name].[contenthash:8].chunk.css",
        orderWarning: false,
        reloadAll: true,
      })
    );

    return config;
  },
});
