<template>
  <div id="nav">
    <Deamon />
    <!-- <router-link to="/about">About</router-link> -->
    
  <router-view/>
  </div>
</template>

<script>
import Deamon from '@/components/Deamon.vue';
export default {
  name: 'App',
  components: {Deamon},
}
</script>

<style>
</style>
