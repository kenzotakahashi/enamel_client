import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import Home from './views/Home.vue'
import Signup from './views/Signup.vue'
import Login from './views/Login.vue'
import Workspace from './views/Workspace.vue'
import Folder from './views/Folder.vue'
import Workload from './views/Workload.vue'
import List from './views/List.vue'
import FolderDetail from './views/FolderDetail.vue'
import Task from './views/Task.vue'
import Account from './views/Account.vue'
import Decline from './views/Decline.vue'
import Notifications from './views/Notifications.vue'
import Settings from './views/Settings.vue'
import Timelog from './views/Timelog.vue'

Vue.use(Router)

const login = {
  path: '/login',
  name: 'login',
  component: Login,
  meta: { title: 'Login - enamel' }
}

const workspace = {
  path: '/w',
  name: 'workspace',
  component: Workspace,
  meta: { title: 'Workspace - enamel', requiresAuth: true },
  children: [
    {
      path: 'folder/:id',
      component: Folder,
      props: true,
      children: [
        {
          path: 'list',
          component: List,
          props: true,
          children: [
            {
              path: '',
              name: 'folder',
              props: true,
              component: FolderDetail
            },
            {
              path: ':taskId',
              name: 'task',
              component: Task,
              props: true
            }
          ]
        },
        {
          path: 'workload',
          name: 'workload',
          component: Workload,
          props: true
        }
      ]
    },
    {
      path: 'notifications',
      name: 'notifications',
      component: Notifications,
      meta: { title: 'Notifications - enamel' },
      props: true,
      children: [
        {
          path: ':id/:taskId',
          name: 'notification-task',
          component: Task,
          props: true
        }
      ]
    },
    {
      path: 'timelog/:id/:year/:month',
      name: 'timelog',
      component: Timelog,
      meta: { title: 'Timelog - enamel' },
      props: true,
    }
  ]
}

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: { title: 'enamel', redirect: true }
    },
    {
      path: '/signup/:id',
      name: 'signup',
      component: Signup,
      meta: { title: 'Signup - enamel' }
    },
    login,
    {
      path: '/decline/:id',
      name: 'decline',
      component: Decline,
      meta: { title: 'enamel' }
    },
    workspace,
    {
      path: '/account',
      name: 'account',
      component: Account,
      meta: { title: 'Accounts - enamel', requiresAuth: true }
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings,
      meta: { title: 'Settings - enamel', requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const auth = localStorage.getItem('user-id')
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if(!auth) {
      next(login)
    }
  } else if (to.matched.some(record => record.meta.redirect)) {
    if(auth) {
      next(workspace)
    }
  }
  next()
})

router.afterEach((to, from) => {
  document.title = `${store.state.notification ? '*' : ''} ${to.meta.title}`
})

export default router