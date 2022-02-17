<template>
  <div class="home">
    <Reg/>
    
  </div>
</template>

<script>
// @ is an alias to /src
import {mapGetters, mapActions} from 'vuex';
import Reg from '@/components/Reg.vue';
export default {
  name: 'Home',
  components: {
    Reg
    // Header
  },
  computed: mapGetters(['all_users', 'start_ws', 'user']),

  methods: mapActions(['websocket_server']),

}
</script>

<style scoped>

</style>
