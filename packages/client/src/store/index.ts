import Vue from "vue";
import Vuex from "vuex";
import { AuthModule } from "@/store/auth";

Vue.use(Vuex);

// export interface RootState {}

const AppStore = new Vuex.Store<any>({
    state: {},
    mutations: {},
    actions: {},
    modules: {
        auth: AuthModule,
    },
});

export default AppStore;
