<template>
  <v-app>
    <NavBar></NavBar>
    <v-main>
      <div class="page">
        <slot></slot>
      </div>
    </v-main>
    <Loading></Loading>
  </v-app>

</template>

<script setup>
import NavBar from '@/components/navbar/navbar'
import Loading from '@/components/modal/loading'
</script>

<style lang="scss">
.page {
  display: flex;
  flex-direction: column;
  padding: 8px 16px;
}
</style>