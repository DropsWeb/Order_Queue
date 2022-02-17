<template>
  <div class="deamon"></div>
</template>

<script>
import { useStore } from "vuex";
export default {
  name: "Deamon",
  created: function () {
    this.$router.push({ name: "Home" });

    const store = useStore();

    console.log("Starting connection to WebSocket Server");
    //Бой
    let connection = new WebSocket("wss://vseklevo.ru:3001");

    //Dev
    // let connection = new WebSocket("ws://localhost:8999");

    store.dispatch("start_server", connection);
  },
};
</script>
