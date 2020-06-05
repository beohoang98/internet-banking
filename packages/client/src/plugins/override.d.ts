import { library } from "@fortawesome/fontawesome-svg-core";
import Vue from "vue";

declare module "vue/types/vue" {
    export interface VueConstructor<V extends Vue = Vue> {
        $fa: typeof library;
    }
    interface Vue {
        $vs: Record<string, any>;
    }
}
