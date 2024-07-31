import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/home.vue'
import AccountView from '@/views/account.vue'
import TransactionView from '@/views/transaction.vue'
import NotFoundView from '@/views/notFound.vue'


const router = createRouter({
  history: createWebHistory(),
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
      path: '/:pathMatch(.*)', 
      name: 'notFound',
      component: NotFoundView 
    }
  ]
})

export default router
