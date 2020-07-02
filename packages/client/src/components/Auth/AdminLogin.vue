<template>
    <div style="padding: 16px;">
        <el-row type="flex" justify="center">
            <el-col :md="8">
                <el-form
                    @submit.native.prevent="onSubmit"
                    :model="form"
                    :disabled="submitting"
                >
                    <el-form-item label="email" required>
                        <el-input
                            type="text"
                            prefix-icon="el-icon-user"
                            v-model="form.email"
                        />
                    </el-form-item>
                    <el-form-item label="password" required>
                        <el-input
                            type="password"
                            prefix-icon="el-icon-lock"
                            v-model="form.password"
                        />
                    </el-form-item>
                    <vue-recaptcha
                        ref="captcha"
                        :sitekey="siteKey"
                        loadRecaptchaScript
                        size="invisible"
                        @verify="onVerify"
                        @expired="() => captcha.reset()"
                        @error="onError"
                    >
                    </vue-recaptcha>
                    <el-button native-type="submit" :loading="submitting"
                        >Submit</el-button
                    >
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Ref } from "vue-property-decorator";
import { Action } from "vuex-class";
import { LoginRequest } from "@/admins/store/auth/types";
import VueRecaptcha from "vue-recaptcha";
import { Form } from "element-ui";

@Component({
    name: "admin-login",
    components: {
        VueRecaptcha,
    },
})
export default class AdminLogin extends Vue {
    @Ref("captcha") captcha!: VueRecaptcha;
    @Ref("form") formRef!: Form;

    form = {
        email: "",
        password: "",
    };
    submitting = false;

    @Action("auth/login") login!: (payload: LoginRequest) => Promise<any>;

    get siteKey(): string {
        return process.env.VUE_APP_RECAPTCHA_SITE_KEY;
    }

    onSubmit() {
        this.captcha.execute();
    }

    onError() {
        this.$alert("Captcha error");
    }

    async onVerify() {
        this.submitting = true;
        try {
            await this.login({
                email: this.form.email,
                password: this.form.password,
            });
            await this.$router.push({ name: "home" });
        } catch (e) {
            this.$message.error({
                message: e?.response?.data?.message || e + "",
            });
        } finally {
            this.submitting = false;
            this.captcha.reset();
        }
    }
}
</script>
