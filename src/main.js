import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'  // 引入默认样式
Vue.config.productionTip = false;
Vue.use(Antd)
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
