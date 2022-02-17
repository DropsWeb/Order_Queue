<template>
    <div class="table">
        <div class="table_windows">
            <div class="table_window">
                <div class="table_header">
                    Готовятся
                </div>
                <div class="table_body">
                    <div class="table_order" v-for="order in select_room.orders" :key="order.id" style="background: #F56C6C">{{order}}</div>    
                </div>
            </div>
            <div class="table_window">
                <div class="table_header">
                    Готовы
                </div>
                <div class="table_body">
                    <div class="table_order" v-for="order in select_room.end_orders" :key="order.id" style="background: #67C23A;">{{order}}</div>
                </div>
            </div>
        </div>
        <div class="table_info">
            <div class="table_info-text">Доставка <strong>{{select_room.phone}}</strong></div>
            <div class="table_info-text"><strong>{{select_room.delivery}}</strong></div>
        </div>
    </div>
</template>

<script>
import { mapGetters} from 'vuex';

export default {
    name: 'Table',
    computed: {
        ...mapGetters(['select_room'])
    },
    mounted: function() {
        let audio = new Audio(require('@/assets/ringtone.mp3'));
        this.$store.commit('add_ringtone', audio)
    },
}
</script>

<style>
    .table{
        display: flex;
        flex-direction: column;
    }
    .table_windows {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 30px;
    }
    .table_header {
        text-align: center;
        font-size: 75px;
        font-weight: 300;
        font-family: sans-serif;
    }
    .table_body {
        border: 1px solid black;
        border-radius: 10px;
        padding: 10px;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-auto-rows: 60px;
        gap: 20px;
        height: 550px;
        overflow: hidden;
    }
    .table_order {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 60px;
        color: #ffffff;
        font-size: 50px;
        border-radius: 10px;
    }
    .table_info {
        display: flex;
        justify-content: center;
    }
    .table_info-text {
        font-size: 55px;
        margin: 0px 40px;
    }

</style>