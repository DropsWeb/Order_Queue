<template>
    <div class="control">
        <el-row>
            <el-col :span="18">
                <el-input placeholder="Введите номер заказа" v-model="order" inputmode='numeric' required></el-input>
            </el-col>
            <el-col :span="4" style='margin-left: 4px'>
                <el-button type="success" @click="create_order(order)">Создать</el-button>
            </el-col>
        </el-row>
        <el-container class="container_el">
            <el-header class="header_el">
                Готовятся
            </el-header>
            <el-row class="order_list">
                <el-col class="order_elem" v-for="order in select_room.orders" :key="order.id" :span="6"><el-button type="danger" @click="end_order(order)">{{order}}</el-button></el-col>
            </el-row>
        </el-container>


        <el-container class="container_el">
            <el-header class="header_el">
                Готовы
            </el-header>
            <el-row class="order_list">
                <el-col class="order_elem" v-for="order in select_room.end_orders" :key="order.id" :span="6"><el-button type="success" @click="remove_order(order)">{{order}}</el-button></el-col>
            </el-row>
        </el-container>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'Control',
    data() {
        return {
            order: '',
        }
    },
    computed: {
        ...mapGetters(['select_room'])
    },
    methods: {
        create_order(order){
            if(order == '')
                return;

            let data = {
                type: 'create_order',
                order: order,
                id_room: this.select_room.id
            };
            this.$store.dispatch('ws_message', JSON.stringify(data));
            this.order = '';
        },
        end_order(order) {
            let data = {
                type: 'end_order',
                order: order,
                id_room: this.select_room.id
            }
            this.$store.dispatch('ws_message', JSON.stringify(data));
        },
        remove_order(order) {
            let data = {
                type: 'remove_order',
                order: order,
                id_room: this.select_room.id
            }
            this.$store.dispatch('ws_message', JSON.stringify(data));
        }
    }
}
</script>

<style>
    .container_el {
        border: 1px solid #000;
        margin: 15px 0px;
    }
    .header_el {
    background: rgb(186, 186, 186);
    font-size: 21px;
    font-weight: 900;
    display: flex;
    align-items: center;
    }
    .order_list {
        margin-top: 10px;
        padding: 10px;
    }
    .order_elem {
        margin: 5px;
    }
</style>