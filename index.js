const ExtractCssChunks = require("extract-css-chunks-webpack-plugin");

module.exports = (config) => {
  return Object.assign({}, config, {
    webpack: (config, options) => {
      const { dev } = options;
      const {
        lessOptions = {
          javascriptEnabled: true,
          modifyVars: lessVarObj,
        },
      } = options.config;

      config.module.rules.push({
        test: /\.less$/,
        exclude: /\.module\.less$/,
        use: [
          ExtractCssChunks.loader,
          { loader: "css-loader", options: { importLoaders: 1 } },
          {
            loader: "less-loader",
            options: { lessOptions },
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

      config.module.rules.push({
        test: /\.module\.less$/,
        exclude: /node_modules/,
        use: [
          ExtractCssChunks.loader,
          {
            loader: "css-loader",
            options: { modules: true, importLoaders: 1 },
          },
          {
            loader: "less-loader",
            options: { lessOptions },
          },
        ],
      });

      if (typeof config.webpack === "function") {
        return config.webpack(config, options);
      }

      return config;
    },
  });
};
