const path = require("path");
const webpack = require("webpack");

module.exports = {
    mode: "production",
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "htmlqoi.min.js",
    },
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: ["babel-loader"],
            },
        ],
    },
    resolve: {
        extensions: [".js"],
        modules: [path.resolve(__dirname, "src")],
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.browser": "true",
        }),
    ],
};
