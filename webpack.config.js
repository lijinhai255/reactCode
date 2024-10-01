const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  mode: "development", // 或 'production'
  entry: "./src/index.js", // 项目入口文件
  output: {
    path: path.resolve(__dirname, "dist"), // 输出目录
    filename: "bundle.js", // 输出的文件名
  },
  module: {
    rules: [
      {
        test: /\.js?$/, // 匹配 .js 或 .jsx 文件
        exclude: /node_modules/, // 排除 node_modules 目录
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              ["@babel/preset-env", { targets: "defaults" }],
              "@babel/preset-react", // 编译 React JSX 语法
            ],
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "React", // HTML 页面标题
      template: path.join(__dirname, "src/index.html"), // HTML 模板文件的路径
    }),
  ],
  resolve: {
    extensions: [".js", ".jsx"], // 自动解析扩展名
  },
  devServer: {
    static: path.join(__dirname, "dist"), // 设置开发服务器的根目录
    hot: true, // 启用热模块替换（Hot Module Replacement）
    open: true, // 启动时自动打开浏览器
    port: 3000, // 设置端口
  },
};
