<template>
    <el-dialog
        v-model="isActive"
        title="Редактирование кафе"
        width="30%"
        custom-class="edit_form"
        :before-close="handleClose"
    >
    <div class="edit">
        <el-row class="mt">
            <el-form 
            ref="ruleForm"
            label-width="100px"
            class="edit_form"
            :model="ruleForm"
            :rules="rules"
            >
                <el-form-item label="Название" prop="name">
                    <el-input v-model="ruleForm.name" width="100%"></el-input>
                </el-form-item>
                    <el-form-item label="Сайт" prop="delivery"> 
                <el-input v-model="ruleForm.delivery"></el-input>
                </el-form-item>
                    <el-form-item label="Телефон" prop="phone">
                    <el-input v-model="ruleForm.phone"></el-input>
                </el-form-item>
            </el-form>
        </el-row>
    </div>
    <template #footer>
        <span class="dialog-footer">
            <el-button @click="isActive = false">Отмена</el-button>
            <el-button type="success" @click="submitForm('ruleForm')"
        >Применить</el-button
    >
        </span>
    </template>
    </el-dialog>
</template>
<script>
export default {
    name: "Edit",
    props: {
        active: {
            type: Boolean,
            default: false
        },
        edit_data: {
            type: Object
        }
    },
    data() {
        return {
            windowWidth: window.innerWidth,
            isActive: this.active,
            ruleForm: {
                id: this.edit_data.id,
                name: this.edit_data.name,
                delivery: this.edit_data.delivery,
                phone: this.edit_data.phone,
                type: "edit_room",
            },

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
            this.isActive = false;
            } else {
            console.log('error submit');
            return false;
            }
        })
        }
    },
    watch: {
        active(val) {
            if(val === true){
                this.isActive = true;
            }
        },
        edit_data(val) {
            this.ruleForm = {
                id: val.id,
                name: val.name,
                delivery: val.delivery,
                phone: val.phone,
                type: "edit_room",
            };
        },

    }
};
</script>
<style>
.edit {
    width: 100%;
}

.mt {
    margin-top: 20px;
}

@media screen and (max-width: 1378px){
    .edit_form {
        --el-dialog-width: 50% !important;
    }
}
@media screen and (max-width: 1000px){
    .edit_form {
        --el-dialog-width: 80% !important;
    }
}
@media screen and (max-width: 800px){
    .edit_form {
        --el-dialog-width: 95% !important;
    }
}
</style>
