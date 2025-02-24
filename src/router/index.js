import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/home.vue'
import AccountView from '@/views/account.vue'
import TransactionView from '@/views/transaction.vue'
import TableTestView from '@/views/tableTest.vue'
import NotFoundView from '@/views/notFound.vue'
import visNetworkView from '@/views/visNetworkView.vue'
import test from '@/views/test.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/account/:searchValue?',
      name: 'account',
      component: AccountView
    },
    {
      path: '/transaction/:searchValue?',
      name: 'transaction',
      component: TransactionView
    },
    {
      path: '/tableTest',
      name: 'tableTest',
      component: TableTestView
    },
    {
      path: '/test1',
      name: 'test1',
      component: test
    },
    { 
      path: '/:pathMatch(.*)', 
      name: 'notFound',
      component: NotFoundView 
    },
    { 
      path: '/visNetworkView', 
      name: 'visNetworkView',
      component: visNetworkView 
    }
  ]
})

export default router
