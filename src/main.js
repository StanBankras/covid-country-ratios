import Vue from 'vue'
import App from './App.vue'
import JsonCSV from 'vue-json-csv'
 
Vue.component('downloadCsv', JsonCSV)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
