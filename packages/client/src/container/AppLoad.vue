<template>
    <div id="app-loader" v-loading="!isLocalLoaded">
        <router-view />
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Action, Getter } from "vuex-class";
import { Component } from "vue-property-decorator";
import AppLoading from "@/components/AppLoading.vue";
import { extend } from "vee-validate";
import { Loading } from "element-ui";

Vue.use(Loading);

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

    isLocalLoaded = false;

    async loadValidate() {
        const { messages } = await import("vee-validate/dist/locale/en.json");
        const rules = await import("vee-validate/dist/rules");

        for (const [rule, validation] of Object.entries(rules)) {
            extend(rule, {
                ...validation,
                // @ts-ignore
                message: messages[rule],
            });
        }
    }

    watchIsLoaded(this: this, [isLoaded]: any[]) {
        if (isLoaded && !this.isLocalLoaded) {
            console.debug("Count me");
            if (this.isLogged) {
                this.isLocalLoaded = isLoaded;
            } else {
                const to = this.$route;
                if (to.matched.some((record) => !!record.meta.auth)) {
                    this.$router.replace({ name: "login" });
                } else {
                    this.isLocalLoaded = isLoaded;
                }
            }
        }
    }

    async mounted(): Promise<void> {
        this.$watch<any[]>(
            function () {
                return [this.isLoaded, this.$route];
            },
            this.watchIsLoaded,
            {
                immediate: true,
            },
        );
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
