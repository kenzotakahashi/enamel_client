import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import About from './views/About.vue'
import Signup from './views/Signup.vue'
import Login from './views/Login.vue'
import Workspace from './views/Workspace.vue'
import Folder from './views/Folder.vue'
import Task from './views/Task.vue'

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
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/workspace',
      name: 'workspace',
      component: Workspace,
      children: [
        {
          path: 'folder/:id',
          name: 'folder',
          component: Folder,
          children: [
            {
              path: 'task/:taskId',
              name: 'task',
              component: Task
            }
          ]
        }
      ]
    },
    {
      path: '/about',
      name: 'about',
      component: About
    }
  ]
})
