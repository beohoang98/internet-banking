import { Module } from "vuex";
import { axiosInstance } from "@/utils/axios";

export interface DebtState {
    data: any[];
    isLoading: boolean;
    isLoaded: boolean;
}
export interface CreateDebt {
    desAccountNumber: string;
    amount: number;
    note: string;
}
export interface DeleteDebt {
    id: number;
    note: string;
}

export const DebtModule: Module<DebtState, any> = {
    namespaced: true,
    state() {
        return {
            data: [{}],
            isLoading: false,
            isLoaded: false,
        };
    },
    getters: {
        data: (state: DebtState): any => state.data,
        isLoading: (state: DebtState): boolean => state.isLoading,
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
        async loadDebtList({ commit }) {
            try {
                commit("setLoading", true);
                const { data: data } = await axiosInstance.get("/debt");
                console.log(data);
                commit("setData", data);
            } finally {
                commit("setLoading", false);
                commit("setLoaded", true);
            }
        },

        async addDebt({ commit }, createData: CreateDebt) {
            try {
                commit("setLoading", true);
                const { data: data } = await axiosInstance.post("/debt", {
                    desAccount: createData.desAccountNumber,
                    amount: Number(createData.amount),
                    remindNote: createData.note,
                });
                console.log(data);
                this.dispatch("debt/loadDebtList");
            } finally {
                commit("setLoading", false);
                commit("setLoaded", true);
            }
        },
        async deleteDebt({ commit }, deleteData: DeleteDebt) {
            try {
                commit("setLoading", true);
                const { data: data } = await axiosInstance.delete("/debt", {
                    data: {
                        deptId: Number(deleteData.id),
                        completeNote: deleteData.note,
                    },
                });
                console.log(data);
                this.dispatch("debt/loadDebtList");
            } finally {
                commit("setLoading", false);
                commit("setLoaded", true);
            }
        },
    },
};
