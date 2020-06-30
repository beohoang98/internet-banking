import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router/admin";
import store from "./admins/store";
Vue.config.productionTip = false;

import "./plugins/vee-validate";
import "./plugins/font-awesome";

import ElementUI from 'element-ui';
Vue.use(ElementUI);

import "@/filters";

new Vue({
    router,
    store,
    render: (h) => h(App),
    el: "#app",
});
