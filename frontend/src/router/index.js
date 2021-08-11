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
    component: () => import('../views/Team/Team.vue'),
    children: [
      {
        path: '',
        name: 'team',
        component: () => import('../../src/components/Team/TeamPage.vue')
      },
      {
        path: 'teampage',
        name: 'teampage',
        component: () => import('../../src/components/Team/TeamPage.vue')
      },
      {
        path: 'teamofuser',
        name: 'teamofuser',
        component: () => import('../components/Team/TeamOfUser.vue')
      }
    ]
  },
  {
    path: '/conference',
    name: 'conference',
    component: () => import('../views/Conference/Conference.vue')
  },
  {
    path: '/notice',
    name: 'notice',
    component: () => import('../components/PublicComponents/Notice/NoticeSideBar')
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
