import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home/Home.vue'
import login from '../views/Login/Login.vue'

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
  routes
})

export default router
