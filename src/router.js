import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import About from './views/About.vue'
import Signup from './views/Signup.vue'
import Workspace from './views/Workspace.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/signup/:id',
      name: 'signup',
      component: Signup      
    },
    {
      path: '/workspace',
      name: 'workspace',
      component: Workspace
    },
    {
      path: '/about',
      name: 'about',
      component: About
    }
  ]
})
