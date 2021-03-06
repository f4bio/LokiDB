/* global __dirname, module, require */
const path = require("path");

module.exports = (options) => {
  if (options.entry === undefined) {
    throw Error("options.entry must be specified.")
  }
  if (options.filename === undefined) {
    throw Error("options.Filename must be specified.")
  }
  if (options.library === undefined) {
    throw Error("options.library must be specified.")
  }

  return {
    mode: "production",
    entry: options.entry,
    output: {
      filename: options.filename,
      library: options.library,
      libraryTarget: "umd2",
      umdNamedDefine: true,
      globalObject: "typeof self !== 'undefined' ? self : this"
    },
    externals: options.externals,
    resolve: {
      extensions: [".ts"]
    },
    devtool: "source-map",
    module: {
      rules: [
        {
          enforce: "pre",
          test: /\.ts$/,
          loader: "tslint-loader",
          exclude: /node_modules/,
          options: {
            failOnHint: true,
            configFile: path.join("config", "tslint.json"),
          }
        },
        {
          test: /\.ts$/,
          loader: "ts-loader",
          options: {
            configFile: path.join("config", "tsconfig.webpack.json")
          }
        }
      ]
    },
    optimization: {
      minimize: false
    },
  };
};
