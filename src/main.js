// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// komponenty tretich stran
import axios from 'axios'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import locale from 'element-ui/lib/locale/lang/cs-CZ'
import ElementUI from 'element-ui'
// Vlastni komponenty
import DoughnutChart from '@/components/DoughnutChart'
import BarChart from '@/components/BarChart'
import PieChart from '@/components/PieChart'
import LineChart from '@/components/LineChart'
import chartLegend from '@/components/chartLegend'
import Autocomplete from '@trevoreyre/autocomplete-vue'
import '@trevoreyre/autocomplete-vue/dist/style.css'

Vue.config.productionTip = false

/* eslint-disable no-new */
// nacitani komponent
Vue.component('my-doughnut-chart', DoughnutChart)
Vue.component('my-bar-chart', BarChart)
Vue.component('my-pie-chart', PieChart)
Vue.component('my-line-chart', LineChart)
Vue.component('graph-legend', chartLegend)
Vue.component('v-datepicker', ElementUI.DatePicker)

// pouziti knihoven 3tich stran
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(ElementUI, { locale })
Vue.use(Autocomplete)

new Vue({
  el: '#app',
  render: h => h(App),
  router,
  beforeCreate () {
    Vue.prototype.$http = axios
    axios.defaults.xsrfHeaderName = 'X-CSRFToken'
    axios.defaults.xsrfCookieName = 'csrftoken'
  },
  components: { App },
  template: '<App/>'
})
