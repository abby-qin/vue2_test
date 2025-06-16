const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false, // 关闭ESLint检查，
  publicPath: process.env.NODE_ENV === 'production'
    ? '/vue2_test/'  // 必须与你的仓库名一致（区分大小写）
    : '/'
});
