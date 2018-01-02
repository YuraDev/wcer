const path = require("path")
const pack = require("./package.json")

module.exports = (env = { analyze: false }) => ({
  target: "node",
  entry: './src/index.ts',
  devtool: "source-map",
  output: {
    publicPath: ".",
    path: path.resolve(__dirname, "./build"),
    filename: "index.js",
    libraryTarget: "umd"
  },
  externals: [Object.keys(pack.dependencies) || {}],
  resolve: {
    modules: [path.resolve(__dirname, "src"), "node_modules"],
    mainFiles: ["index"],
    extensions: [".ts", ".tsx", ".js", ".json"],
  },
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.tsx?$/,
        loaders: [{ 
          loader: "tslint-loader", 
          options: { configFile: "./tslint.json" } 
        }]
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.txt$/,
        exclude: /node_modules/,
        loaders: ["raw-loader"]
      }
    ]
  }
})