// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import FastClick from 'fastclick'
import axios from 'axios'
import global_ from './components/common/Global'

FastClick.attach(document.body)

// ios 由其它事件外连 click事件需要触发两次
const notNeed = FastClick.notNeeded(document.body)
Vue.prototype.iosClick = function (dom) {
  dom.click()
  if (!notNeed) {
    dom.click()
  }
}

require('es6-promise').polyfill()
Vue.prototype.$ajax = axios
// 设置默认值
// axios.defaults.baseURL = 'https://estock.xyzq.com.cn/coin/springFestival'
// axios.defaults.baseURL = 'http://192.20.102.198:8080/fifa'
axios.defaults.baseURL = 'https://estock.xyzq.com.cn/activity2/pic/fifa'
// axios.defaults.baseURL = 'http://jasonsvr.vipgz1.idcfengye.com/fifa'
// axios.defaults.baseURL = 'https://estock.xyzq.com.cn/activity2/pic/springFestival'
// axios.defaults.headers.get['X-Token'] = 'ceshi'
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

Vue.prototype.GLOBAL = global_

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
