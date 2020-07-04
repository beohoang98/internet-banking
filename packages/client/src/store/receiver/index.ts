import { Module } from "vuex";
import { axiosInstance } from "@/utils/axios";

export interface ReceiverState {
    data: any[];
    isLoading: boolean;
    isLoaded: boolean;
}
export interface CreateReceiver {
    desAccountNumber: string;
    name: string;
    bankType: string;
}
export interface DeleteReceiver {
    id: number;
    index: number;
}
export interface UpdateReceiver {
    desAccountNumber: string;
    name: string;
    bankType: string;
    id: number;
    index: number;
}

export const ReceiverModule: Module<ReceiverState, any> = {
    namespaced: true,
    state() {
        return {
            data: [],
            isLoading: false,
            isLoaded: false,
        };
    },
    getters: {
        data: (state: ReceiverState): any => state.data,
        isLoading: (state: ReceiverState): boolean => state.isLoading,
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
        async loadReceiverList({ commit }) {
            try {
                commit("setLoading", true);
                const { data: data } = await axiosInstance.get("/receiver");
                console.log(data);
                commit("setData", data);
            } finally {
                commit("setLoading", false);
                commit("setLoaded", true);
            }
        },

        async addReceiver({ commit, state }, dataCreate: CreateReceiver) {
            try {
                commit("setLoading", true);
                const { data } = await axiosInstance.post("/receiver", {
                    desAccountNumber: dataCreate.desAccountNumber,
                    name: dataCreate.name,
                    bankType: dataCreate.bankType,
                });

                const cloneData = state.data;
                cloneData?.push(data);
                commit("setData", cloneData);
            } finally {
                commit("setLoading", false);
                commit("setLoaded", true);
            }
        },
        async deleteReceiver(
            { commit, state },
            deleteReceiver: DeleteReceiver,
        ) {
            try {
                commit("setLoading", true);
                await axiosInstance.delete("/receiver/" + deleteReceiver.id);
                const cloneData = state.data;
                cloneData?.splice(deleteReceiver.index, 1);
                commit("setData", cloneData);
            } finally {
                commit("setLoading", false);
                commit("setLoaded", true);
            }
        },
        async updateReceiver(
            { commit, state },
            updateReceiver: UpdateReceiver,
        ) {
            try {
                commit("setLoading", true);
                await axiosInstance.put("/receiver/" + updateReceiver.id, {
                    name: updateReceiver.name,
                    desAccountNumber: updateReceiver.desAccountNumber,
                    bankType: updateReceiver.bankType,
                });
                const cloneData = state.data;
                cloneData[updateReceiver.index].name = updateReceiver.name;
                commit("setDada", cloneData);
            } finally {
                commit("setLoading", false);
                commit("setLoaded", true);
            }
        },
    },
};
