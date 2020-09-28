import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/:yearFrom/:monthFrom/:yearTo/:monthTo/:lim/:searchValue?+:searchType?',
      name: 'helloworld',
      component: HelloWorld
    }
  ]
})
