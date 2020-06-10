<template>
    <div id="app-loader">
        <router-view v-if="isLoaded" />
        <app-loading v-else />
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import { Action, Getter } from "vuex-class";
    import { Component } from "vue-property-decorator";
    import AppLoading from "@/components/AppLoading.vue";
    import { extend } from "vee-validate";

    @Component({
        name: "app-load",
        components: {
            AppLoading,
        },
    })
    export default class AppLoad extends Vue {
        @Getter("auth/isLoaded") isLoaded!: boolean;
        @Getter("auth/isLogged") isLogged!: boolean;
        @Action("auth/loadProfile") loadProfile!: () => Promise<void>;

        async loadValidate() {
            const { messages } = await import(
                "vee-validate/dist/locale/en.json"
            );
            const rules = await import("vee-validate/dist/rules");

            for (const [rule, validation] of Object.entries(rules)) {
                extend(rule, {
                    ...validation,
                    // @ts-ignore
                    message: messages[rule],
                });
            }
        }

        async mounted(): Promise<void> {
            if (!this.isLoaded) {
                try {
                    await this.loadValidate();
                    await this.loadProfile();
                } catch (e) {
                    console.error(e);
                }
            }
        }
    }
</script>
