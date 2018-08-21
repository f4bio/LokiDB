/* global __dirname, module, require */
const path = require("path");
const webpackConigCreator = require('../../config/webpack-config-creator.js');

module.exports = webpackConigCreator({
  entry: path.join(__dirname, "src", "cordova_file_storage.ts"),
  filename: "lokidb.cordova-file-storage.js",
  library: "@lokidb/cordova-file-storage",
  externals: {
    "../../loki/src/loki": "@lokidb/loki",
    "cordova": "cordova"
  },
});
