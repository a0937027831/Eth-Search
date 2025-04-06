<template>
  <v-app-bar color="primary" prominent>
    <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

    <v-toolbar-title>Eth-Search</v-toolbar-title>

    <v-spacer></v-spacer>

  </v-app-bar>

  <v-navigation-drawer v-model="drawer" fixed app>
    <v-list-item v-for="item in items" :key="item.title" :to="item.to" link>
      <v-list-item-title>{{ item.title }}</v-list-item-title>
    </v-list-item>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, watch } from 'vue'

const items = [
  { title: 'home', to: '/' },
  { title: 'account', to: '/account' },
  { title: 'transaction', to: '/transaction' },
  { title: 'test', to: '/test1' },
  { title: 'test2', to: '/test2' },
  { title: 'test3', to: '/test3' },
  { title: 'visNetworkView', to: '/visNetworkView'},
]

const drawer = ref(false)
const group = ref(null)

watch(group, () => {
  drawer.value = false
})
</script>