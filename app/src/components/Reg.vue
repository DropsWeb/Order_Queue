<template>
  <div class="registration">
    <el-form>
        <el-form-item label="Логин" prop="login">
          <el-input type="login" autocomplete="off" v-model="login_user.login"></el-input>
        </el-form-item>
        <el-form-item label="Пароль" prop="pass">
          <el-input type="password" autocomplete="off" v-model="login_user.password"></el-input>
        </el-form-item>
      <el-form-item>
        <el-button @click="authorizarion(login_user)">Submit</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters, useStore } from 'vuex';
import router from '../router';

export default {
  name: 'Reg',
  data(){
    return {
      login_user: {
        login: '',
        password: ''
      }
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  created: function(){
    //Для теста. Переход к комнатам без авторизации. Потом убрать.
    router.push({name: 'Rooms'})
  },
  setup() {
    const store = useStore();
    if(localStorage.getItem('cookie_user')){
      router.push({name: 'Rooms'})
    }

    const authorizarion = function(login_user) {
      let data = {
        type: "save_name",
        name: login_user
      }
      store.dispatch('ws_message', JSON.stringify(data))
      router.push({name: 'Rooms'})
    }

    return {
      authorizarion
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
