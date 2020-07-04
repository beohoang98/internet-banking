import { library } from "@fortawesome/fontawesome-svg-core";
import Vue from "vue";
import { AxiosRequestConfig } from "axios";

declare module "vue/types/vue" {
    interface Vue {
        $vs: Record<string, any>;
    }
}

declare module "axios" {
    interface AxiosRequestConfig {
        _retry?: boolean;
    }
}
