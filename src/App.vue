<template>
<div id="app">
<b-container fluid class="h-100">
<b-row v-for="item in Array(2).keys()" :key="item" class="justify-content-md-center">
<b-col cols="12" sm="12" md="12" lg="5" xl="5" class="" v-for="(chart, index) in getChartsForRow(item)" :key="index">
<b-container class="shadow p-3 mx-1 my-3 rounded">
<b-row class=" justify-content-md-center">
<b-col cols="12" lg="12" class="py-2">
<h3>
{{ chart.title }}
</h3>
</b-col >
</b-row>
<b-row>
<b-col v-if="index % 2 == 0" col-md="4">
  <graph-legend :position="index" :dataLabels="chart.labels" :dataColours="backgroundColor"></graph-legend>
</b-col>
<b-col col-md="8">
  <my-doughnut-chart v-if="chartType==='doughnut' && !isFetching" :chartData="chart.data" ></my-doughnut-chart>
  <my-bar-chart v-if="chartType==='bar' && !isFetching" :chartData="chart.data" ></my-bar-chart>
  <my-pie-chart v-if="chartType==='pie' && !isFetching" :chartData="chart.data" ></my-pie-chart>
  <my-line-chart v-if="chartType==='line' && !isFetching" :chartDrdsz]ata="chart.data" ></my-line-chart>
</b-col>                                                              
<b-col v-if="index % 2 == 1" col-md="4">                              
  <graph-legend :position="index" :dataLabels="chart.labels" :dataColours="backgroundColor">></graph-legend>
</b-col>                                                              
</b-row>                                                              
</b-container>                                                        
</b-col>                                                              
</b-row>                                                              
<b-row class="justify-content-md-center">                             
<b-col col lg="5"  class="my-1 py-1">                                 
      <b-form-radio-group v-model="dataShowType" :options="dataShowTypePicks"
        buttons @change="onChangeDataType"                            
        name="radios-btn-default"></b-form-radio-group>               
</b-col>                                                              
</b-row>                                                              
<b-row class="justify-content-md-center">                             
<b-col col lg="8"  class="my-1 py-1">                                 
      <b-form-radio-group :label-cols-sm="2" v-model="chartType" :options="chartTypePicks"
        buttons @change="onChangeChartType"                           
        name="radios-btn-rounded"></b-form-radio-group>               
</b-col>                                                              
</b-row>                                                              
<b-row class="justify-content-md-center">                             
<b-col col lg="6"  class="my-1 py-1">                                 
  <v-datepicker   class="w-100"  v-model="monthPickerRange"  type="monthrange"
      range-separator="Do"                                            
      @change="dateSelected"                                          
      start-placeholder="První měsíc"                                 
      end-placeholder="Poslední měsíc"/>                              
  </b-col>                                                            
</b-row>                                                              
<b-row class="justify-content-md-center">                             
  <b-col col lg="6"  class="my-1">                                    
    <autocomplete  placeholder="Hledej model, značku" :search="search" ref="autocomplete" :getResultValue="getDisplayValue" @submit="searchFor"></autocomplete>
  </b-col>                                                            
</b-row>                                                              
<b-row class="justify-content-md-center">                             
<b-col col lg="2"  class="my-1">                                      
  <b-button type='submit' @click="find" id='searchButton'>Najdi</b-button>
  </b-col>                                                            
<b-col col lg="2"  class="my-1">                                      
  <b-button v-if="searchResultObject" type='submit' @click="clearSearchResult" id='clearCearchButton'>Smaž hledané</b-button>
  </b-col>                                                            
</b-row>                                                              
</b-container>                                                        
</div>                                                                
</template>                                                           
                                                                      
<script>                                                              
import axios from 'axios'                                             
import 'bootstrap/dist/css/bootstrap.css'                             
import 'bootstrap-vue/dist/bootstrap-vue.css'                         
import 'element-ui/lib/theme-chalk/index.css'                         
export default {                                                      
  name: 'App',                                                        
  props: {},                                                          
  data: function () {                                                 
    return {                                                          
      formats: {                                                      
        title: 'MMMM YYYY',                                           
        weekdays: 'W',                                                
        navMonths: 'MMM',                                             
        input: ['L', 'YYYY-MM', 'YYYY/MM'],                           
        dayPopover: 'MMM, YYYY',                                      
        data: ['L', 'YYYY-MM', 'YYYY/MM']                             
      },                                                              
      searchString: '',                                               
      searchResultObject: null,                                       
      isFetching: true,                                               
      chartTypePicks: [{text: 'Koblížek', value: 'doughnut', disabled: false}, {text: 'Koláč', value: 'pie', disabled: false}, {text: 'Sloupec', value: 'bar', disabled: false}, {text: 'Přímka', value: 'line', disabled: true}],
      chartType: this.$route.params.chartType || 'doughnut',          
      dataShowTypePicks: [{text: 'Celkově', value: 'all', disabled: false}, {text: 'Měsíce', value: 'perMonth', disabled: false}],
      dataShowType: 'all',                                            
      dataAllTypes: ['doughnut', 'pie', 'bar'],                       
      dataPerMonthTypes: ['bar', 'line'],                             
      monthsEnum: ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen', 'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'],
      charts: [ ],                                                    
      info: 'hey',                                                    
      picked: 'hey',                                                  
      headers: {                                                      
        'Content-Type': 'application/json',                           
      },                                                              
      yearFrom: this.$route.params.yearFrom || 2010,                  
      monthFrom: this.$route.params.monthFrom || 1,                   
      yearTo: this.$route.params.yearTo || 2010,                      
      monthTo: this.$route.params.monthTo || 3,                       
      lim: this.$route.params.lim || 5,                               
      monthPickerRange: [new Date(this.$route.params.monthFrom + '-1' + '-' + this.$route.params.yearFrom), new Date(this.$route.params.monthTo + '-1' + '-' + this.$route.params.yearTo)],
      backgroundColorLine: [                                          
        'rgba(255, 99, 132, 0.4)',                                    
        'rgba(54, 162, 235, 0.4)',                                    
        'rgba(255, 206, 86, 0.4)',                                    
        'rgba(75, 192, 192, 0.4)',                                    
        'rgba(153, 102, 255, 0.4)',                                   
        'rgba(255, 159, 64, 0.4)',                                    
        'rgba(255, 159, 64, 0)'                                       
      ],                                                              
      backgroundColor: [                                              
        'rgba(255, 99, 132, 1)',                                      
        'rgba(54, 162, 235, 1)',                                      
        'rgba(255, 206, 86, 1)',                                      
        'rgba(75, 192, 192, 1)',                                      
        'rgba(153, 102, 255, 1)',                                     
        'rgba(255, 159, 64, 1)'                                       
      ],                                                              
      modelBrandSelect: null,                                         
      groupSelect: null,                                              
      types: [ { id: 'new_brands', title: 'Top neprodávanější značky' }, { id: 'new_models', title: 'Top nejprodávanější modely' }, { id: 'new_groups', title: 'Top nejprodávanější třídy' }, { id: 'new_fuels', title: 'Top nejprodávanější paliva' } ],
      modelTypes: [ { id: 'new_models_of_model_n_concurency', title: 'Top nejprodávanější k modelu' }, { id: 'new_models_of_model_fuels', title: 'Top nejprodávanější typy paliva' }, { id: 'new_models_of_model_category_n_concurency', title: 'Top nejprodávanější ve své třídě' } ],
      brandTypes: [ { id: 'new_brands_of_brand_n_concurency', title: 'Top nejprodávanější podobné značky' }, { id: 'new_brands_of_brand_fuels', title: 'Top nejprodávanější typy paliva' }, { id: 'new_brands_models_of_brand', title: 'Top nejprodávanější modely' }, { id: 'new_brands_groups_of_brand', title: 'Top nejprodávanější třídy značky' } ],
      graph: null,                                                    
      data: {                                                         
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{                                                  
          label: '# of Votes',                                        
          data: [12, 19, 3, 5, 2, 3],                                 
          backgroundColor: [                                          
            'rgba(255, 99, 132, 1)',                                  
            'rgba(54, 162, 235, 1)',                                  
            'rgba(255, 206, 86, 1)',                                  
            'rgba(75, 192, 192, 1)',                                  
            'rgba(153, 102, 255, 1)',                                 
            'rgba(255, 159, 64, 1)'                                   
          ]                                                           
        }]                                                            
      },                                                              
      options: {                                                      
        responsive: false,                                            
        animation: {                                                  
          duration: [3000],                                           
          easing: ['easeOutBounce']                                   
        },                                                            
        legend: {                                                     
          display: false,                                             
          position: 'left'                                            
        },                                                            
        title: {                                                      
          display: true,                                              
          position: 'top',                                            
          text: 'Top 5 nejprodavanejsi ',                             
          fontSize: 25                                                
        },                                                            
        tooltips: {                                                   
          bodyFontSize: 15                                            
        }                                                             
      }                                                               
    }                                                                 
  },                                                                  
  mounted () {                                                        
    this.mountedFunction(null, null)                                  
  },                                                                  
  methods: {                                                          
    mountedFunction: function (callback, arg) {                       
      if (this.$route.params.searchValue && this.$route.params.searchType) {
        this.searchResultObject = {}                                  
        this.searchResultObject.value = this.$route.params.searchValue
        this.searchResultObject.type = this.$route.params.searchType  
        this.$refs.autocomplete.setValue({ value: this.$route.params.searchValue, type: this.$route.params.searchType })
      }                                                               
      if (this.searchResultObject && this.searchResultObject.value !== '') {
        this.find()                                                   
      } else {                                                        
        this.isFetching = true                                        
        var promises = []                                             
        this.types.forEach((value) => {                               
          let params = { 'type': value.id, 'year_from': this.yearFrom, 'month_from': this.monthFrom, 'year_to': this.yearTo, 'month_to': this.monthTo, 'lim': this.lim }
          let js = {}                                                 
          promises.push(axios.post('https://vvmrokrv38.execute-api.eu-south-1.amazonaws.com/default/autostatistika', params).then((response) => {
            let l = response.data.map(item => item[0])                
            let d = response.data.map(item => item[1])                
            js = {                                                    
              id: value.id,                                           
              title: value.title,                                     
              labels: l,                                              
              data: {                                                 
                labels: l,                                            
                datasets: [{                                          
                  label: value.title,                                 
                  data: d,                                            
                  backgroundColor: [                                  
                    'rgba(255, 99, 132, 1)',                          
                    'rgba(54, 162, 235, 1)',                          
                    'rgba(255, 206, 86, 1)',                          
                    'rgba(75, 192, 192, 1)',                          
                    'rgba(153, 102, 255, 1)',                         
                    'rgba(255, 159, 64, 1)'                           
                  ],                                                  
                  borderColor: [                                      
                    'rgba(255, 99, 132, 1)',                          
                    'rgba(54, 162, 235, 1)',                          
                    'rgba(255, 206, 86, 1)',                          
                    'rgba(75, 192, 192, 1)',                          
                    'rgba(153, 102, 255, 1)',                         
                    'rgba(255, 159, 64, 1)'                           
                  ],                                                  
                  pointColor: [                                       
                    'rgba(255, 99, 132, 1)',                          
                    'rgba(54, 162, 235, 1)',                          
                    'rgba(255, 206, 86, 1)',                          
                    'rgba(75, 192, 192, 1)',                          
                    'rgba(153, 102, 255, 1)',                         
                    'rgba(255, 159, 64, 1)'                           
                  ],                                                  
                }]                                                    
              }                                                       
            }                                                         
            return js                                                 
          }).catch(() => {}))                                         
        })                                                            
        Promise.all(promises).then((res) => {                         
          if (this.charts.length > 0) {                               
            this.types.forEach((value, index) => {                    
              this.charts[index] = res[index]                         
            })                                                        
          } else {                                                    
            this.charts = res.map((d) => d)                           
          }                                                           
          if (callback !== null) { callback(arg) }                    
          this.isFetching = false                                     
        })                                                            
      }                                                               
    },                                                                
    dateSelected: function (val) {                                    
      this.monthFrom = val[0].getMonth() + 1                          
      this.monthTo = val[1].getMonth() + 1                            
      this.yearFrom = val[0].getYear() + 1900                         
      this.yearTo = val[1].getYear() + 1900                           
    },                                                                
    allTypeChange: function () {                                      
      this.mountedFunction(null, null)                                
    },                                                                
    parsePerMonthData: function () {                                  
      var params = {}                                                 
      var promises = []                                               
      this.charts.forEach((chart) => {                                
        chart.labels.forEach((value, index) => {                      
          let par = {}                                                
          if (this.types.map(item => item.id).includes(chart.id)) { par['brand'] = value; par['fuel'] = value; par['model'] = value; par['group'] = value }
          if (chart.id === 'new_brands_of_brand_n_concurency') { par['brand'] = value }
          if (chart.id === 'new_brands_of_brand_fuels') { par['brand'] = this.searchResultObject.value; par['fuel'] = value }
          if (chart.id === 'new_brands_groups_of_brand') { par['brand'] = this.searchResultObject.value; par['group'] = value }
          if (chart.id === 'new_brands_models_of_brand') { par['model'] = value }
          if (chart.id === 'new_models_of_model_fuels') { par['model'] = this.searchResultObject.value; par['fuel'] = value }
          if (chart.id === 'new_models_of_model_category_n_concurency') { par['model'] = value }
          if (chart.id === 'new_models_of_model_n_concurency') { par['model'] = value }
          params = this.createParams(chart.id + '_per_month', par)    
          promises.push(axios.post('https://vvmrokrv38.execute-api.eu-south-1.amazonaws.com/default/autostatistika', params).then((response) => {
            return ({                                                 
              id: chart.id,                                           
              name: value,                                            
              data: response.data.map((item) => item[0]),             
              backgroundColor: this.backgroundColorLine[index]        
            })                                                        
          }).catch((err) => { console.log(err) }))                    
        })                                                            
      })                                                              
      Promise.all(promises).then((res) => {                           
        this.charts.forEach((chart) => {                              
          //                                                          
          chart.data.datasets = []                                    
          chart.labels = res.filter(item => item.id === chart.id).map(item => item.name)
          chart.data.labels = res.filter(item => item.id === chart.id)[0].data.map((value, index) => this.monthsEnum[(index + parseInt(this.monthFrom) - 1) % 12])
          chart.borderColor = this.backgroundColorLine                
          res.filter(item => item.id === chart.id).forEach((o, index) => {
            chart.data.datasets.push({                                
              labels: res.filter(item => item.id === chart.id).map(item => item.name),
              data: o.data,                                           
              backgroundColor: this.backgroundColor[index],           
              borderColor: this.backgroundColor[index],               
              pointColor: this.backgroundColor[index],                
              strokeColor: this.backgroundColor[index],               
              pointRadius: 4,                                         
              pointBackgroundColor: '#fff',                           
              borderWidth: 2,                                         
              fill: true,                                             
            })                                                        
          })                                                          
        })                                                            
        this.onChangeChartType('line') // vypne isFetching !          
        this.isFetching = false                                       
      })                                                              
    },                                                                
    perMonthTypeChange: async function () {                           
      this.isFetching = true                                          
      this.parsePerMonthData()                                        
    },                                                                
    onChangeChartType: function (val) {                               
      this.isFetching = true                                          
      if (val === 'line') {                                           
        this.charts.forEach((chart, index) => {                       
          chart.data.datasets.forEach((dataset) => {                  
            dataset.backgroundColor = ['rgba(0, 0, 0, 0)']            
            dataset.pointColor = this.backgroundColor[index]          
            dataset.strokeColor = this.backgroundColor[index]         
          })                                                          
        })                                                            
      }                                                               
      if (val === 'bar' && this.dataShowType === 'perMonth') {        
        this.charts.forEach((chart) => {                              
          chart.data.datasets.forEach((dataset, index) => {           
            dataset.backgroundColor = this.backgroundColor[index]     
          })                                                          
        })                                                            
      }                                                               
      this.isFetching = false                                         
    },                                                                
    onChangeDataType: function (val) {                                
      // prepnuti v-model:chartType component:buttonGroup disable a prepnuti na povolenou moznost
      // button s moznosti Mesice('perMonth')                         
      if (val === 'perMonth') {                                       
        this.chartType = 'line'                                       
        this.chartTypePicks.forEach((item) => {                       
          if (this.dataPerMonthTypes.includes(item.value)) {          
            item.disabled = false                                     
          } else {                                                    
            item.disabled = true                                      
          }                                                           
        })                                                            
        this.perMonthTypeChange()                                     
      }                                                               
      // prepnuti v-model:chartType component:buttonGroup disable a prepnuti na povolenou moznost
      // button s moznosti Celkove('all')                             
      if (val === 'all') {                                            
        this.chartType = 'doughnut'                                   
        this.chartTypePicks.forEach((item) => {                       
          if (this.dataAllTypes.includes(item.value)) {               
            item.disabled = false                                     
          } else {                                                    
            item.disabled = true                                      
          }                                                           
        })                                                            
        this.allTypeChange()                                          
      }                                                               
    },                                                                
    // vrati array z charts odriznuty podle indexu 0=0-1 1=2-3        
    getChartsForRow: function (index) {                               
      var zoom = 0                                                    
      var offset = 2                                                  
      if (index === 1) {                                              
        zoom = 1                                                      
        offset = 4                                                    
      }                                                               
      return this.charts.slice(index + zoom, index + offset)          
    },                                                                
    createParams: function (type, par) {                              
      var params = { 'type': type, 'year_from': this.yearFrom, 'month_from': this.monthFrom, 'year_to': this.yearTo, 'month_to': this.monthTo, 'lim': this.lim }
      if (this.searchResultObject && this.searchResultObject !== '' && this.searchResultObject.type === 'st_models') {
        params['model'] = this.searchResultObject.value               
      } else if (this.searchResultObject && this.searchResultObject !== '' && this.searchResultObject.type === 'st_brands') {
        params['brand'] = this.searchResultObject.value               
      }                                                               
      params = Object.assign(params, par)                             
      return params                                                   
    },                                                                
    parseAllData: async function (types) {                            
      var promises = []                                               
      types.forEach((type) => {                                       
        let params = this.createParams(type.id)                       
        promises.push(axios.post('https://vvmrokrv38.execute-api.eu-south-1.amazonaws.com/default/autostatistika', params).then((response) => {
          let js = {                                                  
            id: type.id,                                              
            title: type.title,                                        
            labels: response.data.map(item => item[0]),               
            data: {                                                   
              labels: response.data.map(item => item[0]),             
              datasets: [{                                            
                label: type.title,                                    
                data: response.data.map(item => item[1]),             
                backgroundColor: [                                    
                  'rgba(255, 99, 132, 1)',                            
                  'rgba(54, 162, 235, 1)',                            
                  'rgba(255, 206, 86, 1)',                            
                  'rgba(75, 192, 192, 1)',                            
                  'rgba(153, 102, 255, 1)',                           
                  'rgba(255, 159, 64, 1)'                             
                ],                                                    
                borderColor: [                                        
                  'rgba(255, 99, 132, 1)',                            
                  'rgba(54, 162, 235, 1)',                            
                  'rgba(255, 206, 86, 1)',                            
                  'rgba(75, 192, 192, 1)',                            
                  'rgba(153, 102, 255, 1)',                           
                  'rgba(255, 159, 64, 1)'                             
                ],                                                    
                pointColor: [                                         
                  'rgba(255, 99, 132, 1)',                            
                  'rgba(54, 162, 235, 1)',                            
                  'rgba(255, 206, 86, 1)',                            
                  'rgba(75, 192, 192, 1)',                            
                  'rgba(153, 102, 255, 1)',                           
                  'rgba(255, 159, 64, 1)'                             
                ],                                                    
                strokeColor: [                                        
                  'rgba(255, 99, 132, 1)',                            
                  'rgba(54, 162, 235, 1)',                            
                  'rgba(255, 206, 86, 1)',                            
                  'rgba(75, 192, 192, 1)',                            
                  'rgba(153, 102, 255, 1)',                           
                  'rgba(255, 159, 64, 1)'                             
                ],                                                    
              }]                                                      
            }                                                         
          }                                                           
          return js                                                   
        }))                                                           
      })                                                              
      Promise.all(promises).then((res) => {                           
        while (this.charts && this.charts.length > 3) { this.charts.pop() }
        if (this.charts.length > 0) {                                 
          types.forEach((value, index) => {                           
            this.charts[index] = res[index]                           
          })                                                          
        } else {                                                      
          this.charts = res.map((d) => d)                             
        }                                                             
        this.dataShowType = 'all'                                     
        this.chartType = 'doughnut'                                   
        this.chartTypePicks.forEach((item) => {                       
          if (this.dataAllTypes.includes(item.value)) {               
            item.disabled = false                                     
          } else {                                                    
            item.disabled = true                                      
          }                                                           
        })                                                            
        this.isFetching = false                                       
      })                                                              
    },                                                                
    find: function () {                                               
      if (this.searchResultObject) {                                  
        let path = `/${this.yearFrom}/${this.monthFrom}/${this.yearTo}/${this.monthTo}/${this.lim}/${this.searchResultObject.value}+${this.searchResultObject.type}`
        if (encodeURI(path) !== this.$route.path) {                   
          this.$router.push({ name: 'helloworld', params: { yearFrom: this.yearFrom, monthFrom: this.monthFrom, yearTo: this.yearTo, monthTo: this.monthTo, lim: this.lim, searchValue: this.searchResultObject ? this.searchResultObject.value : null, searchType: this.searchResultObject ? this.searchResultObject.type : null } })
        }                                                             
        if (this.searchResultObject.type === 'st_models') {           
          this.isFetching = true                                      
          this.parseAllData(this.modelTypes)                          
          return                                                      
        }                                                             
        if (this.searchResultObject.type === 'st_brands') {           
          this.isFetching = true                                      
          this.parseAllData(this.brandTypes)                          
        }                                                             
        return                                                        
      }                                                               
      let path = `/${this.yearFrom}/${this.monthFrom}/${this.yearTo}/${this.monthTo}/${this.lim}/+`
      if (encodeURI(path) !== this.$route.path) {                     
        this.$router.push({ name: 'helloworld', params: { yearFrom: this.yearFrom, monthFrom: this.monthFrom, yearTo: this.yearTo, monthTo: this.monthTo, lim: this.lim, searchValue: this.searchResultObject ? this.searchResultObject.value : null, searchType: this.searchResultObject ? this.searchResultObject.type : null } })
      }                                                               
      if (this.dataShowType === 'perMonth') {                         
        this.perMonthTypeChange()                                     
        return                                                        
      }                                                               
      if (this.dataShowType === 'all') {                              
        this.mountedFunction(null, null)                              
      }                                                               
    },                                                                
    search: function (val) {                                          
      return new Promise(resolve => {                                 
        if (val.length < 4) { return resolve([]) }                    
        let params = { 'search': val }                                
        axios.post('https://vvmrokrv38.execute-api.eu-south-1.amazonaws.com/default/autostatistika', params).then((response) => {
          return resolve(response.data)                               
        })                                                            
      })                                                              
    },                                                                
    searchFor: function (val) {                                       
      this.searchResultObject = val                                   
    },                                                                
    clearSearchResult: function () {                                  
      this.searchResultObject = null                                  
      this.$refs.autocomplete.value = ''                              
      this.$router.push({ name: 'helloworld', params: { yearFrom: null, monthFrom: null, yearTo: null, monthTo: null, lim: null, searchValue: null, searchType: null } })
      this.onChangeDataType('all')                                    
    },                                                                
    getDisplayValue: function (val) {                                 
      return val.value                                                
    }                                                                 
  }                                                                   
}                                                                     
</script>                                                             
                                                                      
<style>                                                               
body {                                                                
  background-color: #F5F5F5;                                          
}                                                                     
#app {                                                                
  background-color: #F5F5F5;                                          
  font-family: 'Avenir', Helvetica, Arial, sans-serif;                
  -webkit-font-smoothing: antialiased;                                
  -moz-osx-font-smoothing: grayscale;                                 
  height: 100%;                                                       
  text-align: center;                                                 
  color: #2c3e50;                                                     
  margin-top: 0px;                                                    
}                                                                     
                                                                      
</style>                                                              
                                                                      