<template>
    <div class="app-auth-form card">
        <form @submit="onSubmit">
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
        </form>
        <vs-alert v-model="login_error" danger closable flat dark>
            {{ login_error }}
        </vs-alert>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import { Component, Watch } from "vue-property-decorator";
    import {
        faEnvelope,
        faLock,
        faLockOpen,
    } from "@fortawesome/free-solid-svg-icons";
    import { Getter } from "vuex-class";

    Vue.$fa.add(faEnvelope, faLock, faLockOpen);

    @Component({
        name: "Login",
    })
    export default class Login extends Vue {
        email = "";
        password = "";
        login_error = null;

        @Getter("auth/isLogged") isLogged!: boolean;

        @Watch("isLogged")
        ifIsLogged(logged: boolean) {
            if (logged) {
                this.$router.push("/");
            }
        }

        async onSubmit(ev: Event): Promise<void> {
            ev.preventDefault();
            const loading = this.$vs.loading();
            try {
                await this.$store.dispatch("auth/login", {
                    email: this.email,
                    password: this.password,
                });
            } catch (e) {
                this.login_error = e.message || e + "";
            } finally {
                loading.close();
            }
        }

        mounted(): void {
            if (this.isLogged) {
                this.$router.replace("/");
            }
        }
    }
</script>
