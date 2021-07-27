import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home/Home.vue'
import login from '../views/Login/Login.vue'
import register from '../views/Login/Register'
import store from '../store/index.js'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/register',
    name: 'register',
    component: register
  },
  {
    path: '/team',
    name: 'team',
    component: () => import('../views/Team/Team.vue'),
    children: [
      {
        path: 'recentfile',
        name: 'recentfile',
        component: () => import('../../src/components/Team/RecentFile.vue')
      },
      {
        path: 'teambuild',
        name: 'teambuild',
        component: () => import('../../src/components/Team/TeamBuild.vue')
      },
      {
        path: 'teamjoin',
        name: 'teamjoin',
        component: () => import('../../src/components/Team/TeamJoin.vue')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  saveScrollPosition: true,
  routes
})

router.beforeEach(({ meta, path }, from, next) => {
  console.log('meta: ', meta)
  console.log('path: ', path)
  console.log('from: ', from)
  console.log('next: ', next)
  const { auth = true } = meta
  const isLogin = Boolean(store.state.login.token)

  if (auth && isLogin) {
    console.log('I am in')
    return next({ path: '/team' })
  }
  next()
})

export default router
