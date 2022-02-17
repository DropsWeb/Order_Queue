<template>
    <div class="rooms">
      <Admin/>
    <el-table
      :data="rooms"
      style="width: 100%">
      <el-table-column
        label="ID"
        width="40px"
        type="index"
      >
      </el-table-column>
      <el-table-column
        label="Название кафе"
        prop="name">
      </el-table-column>
      <el-table-column
        label="Действия"
        align="right">
        <template v-slot="index">
          <el-button
            size="mini"
            type="success"
            class="mb_10"
            @click="enter_room(index.row)">Войти
          </el-button>
          <el-button
            size="mini"
            type="default"
            class="mb_10"
            @click="open_modal(index.row)">Редактировать
          </el-button>
          <el-popconfirm
            confirm-button-text="Удалить"
            cancel-button-text="Отмена"
            @confirm="delete_room(index.row)"
            icon-color="red"
            title="Удалить данное кафе?"
          >
            <template #reference>
              <el-button
                size="mini"
                type="danger"
              >
              Удалить
              </el-button>
            </template>
          </el-popconfirm>

        </template>
      </el-table-column>
    </el-table>
    </div>
    <Edit
      :active="modalVisible"
      :edit_data="edit_data"
    />  
</template>


<script>
import { useStore, mapGetters } from 'vuex';
import Admin from '@/components/Admin.vue';
import Edit from "@/components/EditRoom.vue";
import router from '../router';

export default {
  name: 'Rooms',
  components: {
    Admin, Edit
  },
  data() {
    return {
      modalVisible: false,
      edit_data: {}
    }
  },
  computed: {
      ...mapGetters(['rooms', 'user'])
  },
  created: function() {
    const store = useStore();
    let message = {
      type: 'get_rooms'
    };
    store.dispatch('get_rooms', message)
  },
  methods: {
    open_modal(data){
      this.edit_data = data;
      this.modalVisible = true;
      setTimeout(() => {
        this.modalVisible = false;
      }, 500)
    },
    change_visible(){
      this.visible = true;
    },
    enter_room(index) {
      this.$store.commit('put_id_room', index.id)
      this.$store.commit('put_mode_room', 'select')
      router.push({name: 'Room', params: {id: index.id}})
    },
    delete_room(index) {
      let data = {
        type :"delete_room",
        id: index.id
      }
      this.$store.dispatch('ws_message', JSON.stringify(data));
      this.show_del = false;
    },
    edit_room() {

    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.popup_warning {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

@media screen and (max-width: 410px){
  .mb_10 {
    margin-bottom: 10px;
  }
}
</style>