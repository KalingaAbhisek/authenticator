const webpack = require("webpack");
module.exports = function override (config, env) {
    console.log('override')
    let loaders = config.resolve
    loaders.fallback = {
        "crypto": require.resolve("crypto-browserify"),
        "path": require.resolve("path-browserify"),
        "os": require.resolve("os-browserify/browser"),
        "zlib": require.resolve("browserify-zlib") ,
        "stream": require.resolve("stream-browserify"),
        "util": require.resolve("util/"),
        "buffer": require.resolve("buffer/"),
        "timers": require.resolve("timers-browserify"), 
        "querystring": require.resolve("querystring-es3"), 
        'process/browser': require.resolve('process/browser'),
        "vm": require.resolve("vm-browserify")
    }
    config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
          process: "process/browser",
          Buffer: ["buffer", "Buffer"],
        }),
      ]);
    
    return config
}