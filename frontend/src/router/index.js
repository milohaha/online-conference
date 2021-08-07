import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home/Home.vue'
import Login from '../views/Login/Login.vue'
import Register from '../views/Login/Register'
import Store from '../store/index.js'

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
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    component: Register
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
        path: 'teamcreate',
        name: 'teamcreate',
        component: () => import('../components/Team/TeamCreate.vue')
      },
      {
        path: 'teamjoin',
        name: 'teamjoin',
        component: () => import('../../src/components/Team/TeamJoin.vue')
      },
      {
        path: 'teammanage',
        name: 'teammanage',
        component: () => import('../../src/components/Team/TeamManage.vue')
      },
      {
        path: 'teamofuser',
        name: 'teamofuser',
        component: () => import('../components/Team/TeamOfUser.vue')
      }
    ]
  },
  {
    path: '/canvas',
    name: 'canvas',
    component: () => import('../components/Conference/Canvas')
  },
  {
    path: '/codeBlock',
    name: 'codeBlock',
    component: () => import('../components/Conference/CodeBlock')
  },
  {
    path: '/conference',
    name: 'conference',
    component: () => import('../views/Conference/Conference.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  saveScrollPosition: true,
  routes
})
router.beforeEach(({ meta, path }, from, next) => {
  const { auth = true } = meta
  const isLogin = Boolean(Store.state.Login.isUserLogin)
  if (isLogin) {
    Vue.prototype.$io.emit('login', localStorage.getItem('userID'))
  }
  if (path === '/') {
    return next()
  }
  if (auth && !isLogin && (path !== '/login' && path !== '/register')) {
    return next({ path: '/' })
  }
  if (isLogin && (path === '/login' || path === '/register')) {
    return next({ path: '/team' })
  }
  next()
})
export default router
