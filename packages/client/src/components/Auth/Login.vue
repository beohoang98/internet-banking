<template>
    <div class="app-auth-form card">
        <form @submit.prevent="onSubmit">
            <validation-provider
                name="email"
                rules="required|email"
                v-slot="{ errors }"
            >
                <vs-input
                    label-placeholder="Email"
                    v-model="email"
                    block
                    :state="errors.length ? 'danger' : ''"
                >
                    <template #icon>
                        <font-awesome-icon
                            icon="envelope"
                            v-model="email"
                        ></font-awesome-icon>
                    </template>
                    <template #message-danger>{{ errors[0] }}</template>
                </vs-input>
            </validation-provider>
            <validation-provider
                name="password"
                rules="required"
                v-slot="{ errors }"
            >
                <vs-input
                    block
                    type="password"
                    label-placeholder="Password"
                    v-model="password"
                    :state="errors.length ? 'danger' : ''"
                >
                    <template #icon>
                        <font-awesome-icon icon="lock"></font-awesome-icon>
                    </template>
                    <template #message-danger>{{ errors[0] }}</template>
                </vs-input>
            </validation-provider>
            <vs-button type="submit" block>Login</vs-button>

            <vue-recaptcha
                ref="captcha"
                :sitekey="siteKey"
                loadRecaptchaScript
                size="invisible"
                @verify="onCaptchaVerify"
                @expired="() => captcha.reset()"
                @error="onCaptchaError"
            />
        </form>
        <vs-alert v-model="login_error" danger closable flat dark>
            {{ login_error }}
        </vs-alert>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Ref, Watch } from "vue-property-decorator";
import {
    faEnvelope,
    faLock,
    faLockOpen,
} from "@fortawesome/free-solid-svg-icons";
import { Getter } from "vuex-class";
import VueRecaptcha from "vue-recaptcha";
import { library } from "@fortawesome/fontawesome-svg-core";

library.add(faEnvelope, faLock, faLockOpen);

@Component({
    name: "Login",
    components: { VueRecaptcha },
})
export default class Login extends Vue {
    @Ref("captcha") captcha!: VueRecaptcha;

    email = "";
    password = "";
    login_error: any = null;
    loading: any = null;

    @Getter("auth/isLogged") isLogged!: boolean;

    get siteKey(): string {
        return process.env.VUE_APP_RECAPTCHA_SITE_KEY;
    }

    @Watch("isLogged")
    ifIsLogged(logged: boolean) {
        if (logged) {
            this.$router.push("/");
        }
    }

    onSubmit() {
        this.loading = this.$vs.loading();
        this.captcha.execute();
    }

    async onCaptchaVerify() {
        try {
            await this.$store.dispatch("auth/login", {
                email: this.email,
                password: this.password,
            });
        } catch (e) {
            this.login_error = e.message || e + "";
        } finally {
            this.loading?.close();
            this.captcha.reset();
        }
    }

    onCaptchaError() {
        this.login_error = "Captcha error";
    }

    mounted(): void {
        if (this.isLogged) {
            this.$router.replace("/");
        }
    }
}
</script>
