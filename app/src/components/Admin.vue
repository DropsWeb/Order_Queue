<template>
  <div class="admin">
    <el-row v-if="!toggle_form">
      <el-button @click="change_toggle()">Создать кафe</el-button>
    </el-row>
    <el-row v-if="toggle_form" class="mt">
      <el-form 
      ref="ruleForm"
      label-width="150px" 
      :model="ruleForm"
      :rules="rules"
      >
        <el-form-item label="Название" prop="name">
          <el-input v-model="ruleForm.name" width="100%"></el-input>
        </el-form-item>
        <el-form-item label="Сайт" prop="delivery"> 
          <el-input v-model="ruleForm.delivery"></el-input>
        </el-form-item>
        <el-form-item label="Номер телефона" prop="phone">
          <el-input v-model="ruleForm.phone"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="submitForm('ruleForm')">Создать</el-button>
          <el-button type="danger" @click="change_toggle()">Отмена</el-button>
        </el-form-item>
      </el-form>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "Auth",
  data() {
    return {
      ruleForm: {
        name: "",
        delivery: "",
        phone: "",
        type: "create_room",
      },
      toggle_form: false,
      rules: {
        name: [
          {
            required: true,
            message: 'Это поле должно быть заполнено'
          }
        ],
        delivery: [
          {
            required: true,
            message: 'Это поле должно быть заполнено'
          }
        ],
        phone: [
          {
            required: true,
            message: 'Это поле должно быть заполнено'
          }
        ],
      }
    };
  },
  methods: {
    change_toggle() {
      this.toggle_form = !this.toggle_form;
    },
    submitForm(data) {
      this.$refs[data].validate((valid) => {
        if(valid){
          this.$store.dispatch("ws_message", JSON.stringify(this.ruleForm));
          this.change_toggle();
          this.$refs[data].resetFields();
        } else {
          console.log('error submit');
          return false;
        }
      })
    }
  },
};
</script>
<style scoped>
.admin {
  width: 100%;
}

.mt {
  margin-top: 20px;
}
</style>
