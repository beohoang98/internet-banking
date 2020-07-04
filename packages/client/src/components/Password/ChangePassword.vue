<template>
    <div class="ChangePasswod">
        <h1>Change Passwod</h1>
        <el-form
            :model="form"
            status-icon
            :rules="rules"
            ref="form"
            label-width="120px"
            class="demo-ruleForm"
        >
            <el-form-item label="Old Password" prop="pass">
                <el-input
                    type="password"
                    v-model="form.oldPass"
                    autocomplete="off"
                ></el-input>
            </el-form-item>
            <el-form-item label="New Password" prop="pass">
                <el-input
                    type="password"
                    v-model="form.newPass"
                    autocomplete="off"
                ></el-input>
            </el-form-item>
            <el-form-item label="Confirm" prop="checkPass">
                <el-input
                    type="password"
                    v-model="form.checkPass"
                    autocomplete="off"
                ></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm()"
                    >Submit</el-button
                >
            </el-form-item>
        </el-form>
    </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { Button, Form, FormItem, Input, Message } from "element-ui";
import { axiosInstance } from "../../utils/axios";
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Button);

@Component({
    name: "ChangePassword",
})
export default class ChangePassword extends Vue {
    form = {
        newPass: "",
        checkPass: "",
        oldPass: "",
    };

    async submitForm() {
        console.log(this.form.oldPass, this.form.checkPass);
        if (this.form.newPass !== this.form.checkPass) {
            throw Message({
                showClose: true,
                message: "Password doesn't match",
                type: "error",
            });
        }
        try {
            await axiosInstance.put("/user/password", {
                oldPassword: this.form.oldPass,
                newPassword: this.form.newPass,
            });
            Message({
                showClose: true,
                message: "Change password successful",
                type: "success",
            });
            this.form.newPass = "";
            this.form.oldPass = "";
            this.form.checkPass = "";
        } catch (e) {
            Message({
                showClose: true,
                message: e,
                type: "error",
            });
        }
    }
}
</script>
