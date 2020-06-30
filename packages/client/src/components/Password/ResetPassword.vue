<template>
    <div class="ResetPassword">
        <h1>Reset Passwod</h1>
        <el-button
            type="primary"
            round
            :disabled="disabledGetOtp"
            @click="getOtp()"
            :loading="isLoading"
        >Get OTP</el-button>
        <br />
        <el-form
            :model="form"
            status-icon
            :rules="rules"
            ref="form"
            label-width="120px"
            class="demo-ruleForm"
        >
            <el-form-item label="OTP" prop="otp">
                <el-input type="text" v-model="form.OTP" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="New Password" prop="pass">
                <el-input type="password" v-model="form.newPass" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="Confirm" prop="checkPass">
                <el-input type="password" v-model="form.checkPass" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm()">Submit</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { Button, Form, FormItem, Input, Message } from "element-ui";
import { axiosInstance } from "../../utils/axios";
Vue.component(Form.name, Form);
Vue.component(FormItem.name, FormItem);
Vue.component(Input.name, Input);
Vue.component(Button.name, Button);

@Component({
    name: "ResetPassword",
})
export default class ResetPassword extends Vue {
    form = {
        newPass: "",
        checkPass: "",
        OTP: "",
    };
    disabledGetOtp = false;
    isLoading = false;

    async submitForm() {
        if (this.form.newPass !== this.form.checkPass) {
            throw Message({
                showClose: true,
                message: "Password doesn't match",
                type: "error",
            });
        }
        try {
            await axiosInstance.put("/user/reset-password", {
                otp: Number(this.form.OTP),
                password: this.form.newPass,
            });
            Message({
                showClose: true,
                message: "Change password successful",
                type: "success",
            });
            this.form.newPass = "";
            this.form.OTP = "";
            this.form.checkPass = "";
        } catch (e) {
            Message({
                showClose: true,
                message: e,
                type: "error",
            });
        }
    }
    async getOtp() {
        try {
            this.isLoading = true;
            await axiosInstance.get("/otp");
            Message({
                showClose: true,
                message: "An Otp mail has been sent to you",
                type: "success",
            });
            this.isLoading = false;
            this.disabledGetOtp = true;
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
