// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
//import store from './vuex/store'
import App from './App'
import VueRouter from 'vue-router'
//import VueResource from 'vue-resource'
import routes from './router/index'

Vue.use(VueRouter)
//Vue.use(VueResource)

require('./common/css/reset.css')
Vue.config.productionTip = false
Vue.config.debug = true //开启debug

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import 'bootstrap-daterangepicker/daterangepicker.js'
import 'bootstrap-daterangepicker/daterangepicker.css'
if(process.env.NODE_ENV === 'development'){
	window.api = '/api'
}else{//正式
	window.api = ''
}
const router = new VueRouter({
	routes
})
/* eslint-disable no-new */

var vm = new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
