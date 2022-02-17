<template>
    <div class="room">
        <el-button style="margin-bottom: 10px" type="danger" v-if="select_room.mode !== 'select' && select_room.mode !== 'window'" @click="change_mode('select')">Назад</el-button>
        <div class="select_container" v-if="select_room.mode == 'select'">
            <h1>Выберите режим</h1>
            <el-row>
                <el-button type="success" @click="change_mode('control')">Управление</el-button>
                <el-button type="success" @click="change_mode('window')">Экран</el-button>
            </el-row>
        </div>
        <div class="window_container" v-if="select_room.mode == 'control'">
            <Control/>
        </div>
        <div class="control_container" v-if="select_room.mode == 'window'">
            <Table/>
        </div>
    </div>
</template>

<script>
import { mapGetters, useStore } from 'vuex';
import Control from '@/components/Control.vue';
import Table from '@/components/Table.vue';
import router from '../router';

export default {
    name: 'Room',
    components: {
        Control,
        Table
    },
    computed: {
        ...mapGetters(['select_room'])
    },
    methods: {
        change_mode(mode) {
            this.$store.commit('put_mode_room', mode)
        }
    },
    setup() {
        let store = useStore();

        let id = router.currentRoute.value.params.id;
        let data = {
            type: 'get_room',
            room: id
        }
        console.log('отправляю запрос комнаты')
        console.log(data)
        store.dispatch('ws_message', JSON.stringify(data));
    }
}
</script>

<style>

</style>