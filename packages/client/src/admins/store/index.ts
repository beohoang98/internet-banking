import Vue from "vue";
import Vuex from "vuex";
import { AdminAuthModule } from "@/admins/store/auth";
import { UsersModule } from "@/admins/store/users";

Vue.use(Vuex);

export const AdminStore = new Vuex.Store<any>({
    state: {},
    mutations: {},
    actions: {},
    modules: {
        auth: AdminAuthModule,
        users: UsersModule,
    },
});

export default AdminStore;
