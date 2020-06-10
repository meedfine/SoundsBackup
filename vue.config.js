module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        // options placed here will be merged with default configuration and passed to electron-builder
        productName: "Sounds",
        icon: "./public/favicon.ico",
        publish: {
          provider: "generic",
          url: "http://127.0.0.1:5500/",
          channel: "latest"
        },
        nsis: {
          allowElevation: true
        },
        asarUnpack: ["**/*"]
      }
    }
  },
  css: {
    loaderOptions: {
      scss: {
        prependData: `
          @import "~@/assets/style/_common.scss";
          @import "~@/assets/style/_variables.scss";
          @import "~@/assets/style/_mixins.scss";
          @import "~@/assets/style/_icons.scss";
        `
      }
    }
  },
  configureWebpack: {
    devtool: "source-map"
  }
  // productionSourceMap: true
};
