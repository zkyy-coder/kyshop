import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入fastclick
import FastClick from 'fastclick'
if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', function() {
      FastClick.attach(document.body);
  }, false);
}

// 引入二维码生成器
import VueQriously from 'vue-qriously'
Vue.use(VueQriously)

// 引入全局样式
import '@/assets/css/common.less'

// 引入全局Vant组件库
import '@/plugins/vant.js'

// 引入rem
import '@/config/rem.js'

// 引入全局过滤器
import '@/config/filters'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
