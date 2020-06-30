import Vue from "vue";
import Vuex from "vuex";
import { AdminAuthModule } from "@/admins/store/auth";

Vue.use(Vuex);

export const AdminStore = new Vuex.Store<any>({
    state: {},
    mutations: {},
    actions: {},
    modules: {
        auth: AdminAuthModule,
    },
});

export default AdminStore;
