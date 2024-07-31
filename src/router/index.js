import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/home.vue'
import AccountView from '@/views/account.vue'
import TransactionView from '@/views/transaction.vue'


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
  ]
})

export default router
