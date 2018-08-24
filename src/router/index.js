import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import NewUser from '@/components/NewUser'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/new-user',
      name: 'New user',
      component: NewUser
    }
  ],
  mode: 'history'
})
