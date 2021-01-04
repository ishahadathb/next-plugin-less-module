const ExtractCssChunks = require("extract-css-chunks-webpack-plugin");

/** Provide nextConfig options along with less & css loader options
 * @param {nextConfig}
 * @param {lessLoaderOptions} for available options https://github.com/webpack-contrib/less-loader#options
 * @param {cssLoaderOptions}  https://github.com/webpack-contrib/css-loader#options
 */

module.exports = (nextConfig = {}) => ({
  ...nextConfig,
  webpack: (config, options) => {
    const { dev } = options;
    const { lessLoaderOptions = {}, cssLoaderOptions = {} } = pluginConfig;

    config.module.rules.push({
      test: /\.less$/,
      exclude: /\.module\.less$/,
      use: [
        ExtractCssChunks.loader,
        {
          loader: "css-loader",
          options: { importLoaders: 1, ...cssLoaderOptions },
        },
        {
          loader: "less-loader",
          options: {
            lessOptions: { javascriptEnabled: true },
            ...lessLoaderOptions,
          },
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

    if (typeof nextConfig.webpack === "function")
      return nextConfig.webpack(config, options);

    return config;
  },
});
