<template>
    <form class="app-auth-form card" @submit="onSubmit">
        <vs-input label-placeholder="Email" v-model="email" block>
            <template #icon>
                <font-awesome-icon
                    icon="envelope"
                    v-model="email"
                ></font-awesome-icon>
            </template>
        </vs-input>
        <vs-input
            block
            type="password"
            label-placeholder="Password"
            v-model="password"
            :visible-password="visiblePassword"
        >
            <template #icon>
                <font-awesome-icon
                    icon="lock"
                    @click="visiblePassword = !visiblePassword"
                ></font-awesome-icon>
            </template>
        </vs-input>

        <vs-button :loading="isSubmitting" type="submit" block>Login</vs-button>
    </form>
</template>

<script lang="ts">
    import Vue from "vue";
    import { Component } from "vue-property-decorator";
    import {
        faEnvelope,
        faLock,
        faLockOpen,
    } from "@fortawesome/free-solid-svg-icons";

    Vue.$fa.add(faEnvelope, faLock, faLockOpen);

    @Component({
        name: "Login",
    })
    export default class Login extends Vue {
        email = "";
        password = "";
        visiblePassword = false;
        isSubmitting = false;

        async onSubmit(ev: Event): Promise<void> {
            ev.preventDefault();
            // this.isSubmitting = true;
            const loading = this.$vs.loading();
            this.$store;
            setTimeout(() => {
                loading.close();
            }, 1000);
        }
    }
</script>
