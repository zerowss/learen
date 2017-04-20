import Vue from 'vue'
import Router from 'vue-router'
import seller from '@/components/seller/seller'
import goods from '@/components/goods/goods'
import ratings from '@/components/ratings/ratings'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path : '/',
      redirect : '/goods'
    },
    {
      path: '/seller',
      component: seller
    },
    {
      path: '/goods',
      component : goods
    },
    {
      path: '/ratings',
      component : ratings
    }
  ],
  linkActiveClass : 'active'
})
