import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/home.vue'
import AccountView from '@/views/account.vue'
import TransactionView from '@/views/transaction.vue'
import TableTestView from '@/views/tableTest.vue'
import NotFoundView from '@/views/notFound.vue'
import visNetworkView from '@/views/visNetworkView.vue'
import test from '@/views/test.vue'
import test2 from '@/views/test2.vue'
import test3 from '@/views/test3.vue'


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
      path: '/test2',
      name: 'test2',
      component: test2
    },
    {
      path: '/test3',
      name: 'test3',
      component: test3
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
