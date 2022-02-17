<template>
    <header>
        <div class="back_arrow"></div>
        <h1>обломи меня</h1>
    </header>
</template>

<script>
//import { useStore } from 'vuex';

export default {
  name: 'Header',
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    header {
        display: flex;
        padding: 0;
        margin: 0;
        justify-content: center;
    }
    header>h1{
        padding: 0;
        margin: 5px;
        text-transform: uppercase;
    }
    .back_arrow {
        position: absolute;
        margin: 5px;
        left: 15px;
        background-image: url('../img/back_arrow.svg');
        background-size: cover;
        width: 30px;
        height: 30px;
        cursor: pointer;
    }
</style>
