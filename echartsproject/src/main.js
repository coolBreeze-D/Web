import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'
import router from './router'
import store from './store'
//import echarts from 'echarts'

//引入字体文件
import 'assets/font/iconfont.css'

//引入全局css文件 
import 'assets/css/global.less'


//将axios挂载到Vue的原型上，在别的组件中可用 this.$http
axios.defaults.baseURL = "http://localhost:8080/static/"
Vue.prototype.$http = axios


//将echarts.js文件挂载到Vue的原型
Vue.prototype.$echarts = window.echarts



Vue.config.productionTip = false

new Vue({
  router,
	store,
  render: h => h(App)
}).$mount('#app')
