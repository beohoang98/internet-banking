import { Module } from "vuex";
import { axiosInstance } from "@/utils/axios";

export interface HistoryState {
    data: any[];
    isLoading: boolean;
    isLoaded: boolean;
}

export const HistoryModule: Module<HistoryState, any> = {
    namespaced: true,
    state() {
        return {
            data: [{}],
            isLoading: false,
            isLoaded: false,
        };
    },
    getters: {
        data: (state: HistoryState): any => state.data,
        isLoading: (state: HistoryState): boolean => state.isLoading,
        isLoaded: (state) => state.isLoaded,
    },
    mutations: {
        setData(state, data) {
            state.data = data;
        },
        setLoading: (state, loading = true) => (state.isLoading = loading),
        setLoaded: (state, loaded = true) => (state.isLoaded = loaded),
    },
    actions: {
        async loadHistoryList({ commit }, type: any) {
            try {
                commit("setLoading", true);
                const { data: data } = await axiosInstance.get(
                    "/transaction/" + type,
                );
                console.log(data);
                commit("setData", data);
            } finally {
                commit("setLoading", false);
                commit("setLoaded", true);
            }
        },
    },
};
