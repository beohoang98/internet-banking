import Vue from "vue";
import Vuex from "vuex";
import { AuthModule } from "@/store/auth";
import { ReceiverModule } from "./receiver";

Vue.use(Vuex);

// export interface RootState {}

const AppStore = new Vuex.Store<any>({
    state: {},
    mutations: {},
    actions: {},
    modules: {
        auth: AuthModule,
        receiver: ReceiverModule,
    },
});

export default AppStore;
