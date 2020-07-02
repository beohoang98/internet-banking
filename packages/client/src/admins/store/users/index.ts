import { Module } from "vuex";
import { axiosInstance } from "@/utils/axios";

export interface AdminUsersState {
    list: User[];
    searchTerm: string;
}

export const UsersModule: Module<AdminUsersState, any> = {
    namespaced: true,
    state: {
        list: [],
        searchTerm: "",
    },
    getters: {
        list: (state) => state.list,
        lastSearchTerm: (state) => state.searchTerm,
    },
    mutations: {
        setList(state, users: User[]) {
            state.list = users;
        },
        setSearchTerm(state, searchTerm: string) {
            state.searchTerm = searchTerm;
        },
    },
    actions: {
        async search({ commit }, term: string) {
            commit("setSearchTerm", term);
            const { data } = await axiosInstance.get<User[]>("/user/search", {
                params: {
                    q: term,
                },
            });
            commit("setList", data);
        },
    },
};
