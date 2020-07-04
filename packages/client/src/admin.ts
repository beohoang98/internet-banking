import Vue from "vue";
import ElementUI from "element-ui";
// @ts-ignore
import en from "element-ui/lib/locale/lang/en";

import VRole from "@/plugins/v-role";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router/admin";
import store from "./admins/store";
import "./plugins/vee-validate";
import "./plugins/font-awesome";

import "@/filters";

Vue.config.productionTip = false;

Vue.use(ElementUI, { locale: en });
Vue.use(VRole);

new Vue({
    router,
    store,
    render: (h) => h(App),
    el: "#app",
});
