/* global __dirname, module, require */
const path = require("path");
const webpackConigCreator = require('../../config/webpack-config-creator.js');

module.exports = webpackConigCreator({
  entry: path.join(__dirname, "src", "ionic_file_storage.ts"),
  filename: "lokidb.ionic-file-storage.js",
  library: "@lokidb/ionic-file-storage",
  externals: {
    "../../loki/src/loki": "@lokidb/loki",
    "File": "@ionic-native/file"
  },
});
