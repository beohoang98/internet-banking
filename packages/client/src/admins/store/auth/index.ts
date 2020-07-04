import { Module } from "vuex";
import { axiosInstance } from "@/utils/axios";
import { LoginRequest } from "@/admins/store/auth/types";
import { LoginResponse } from "@/store/auth/actions";

export interface AdminAuthState {
    user?: Admin;
    isLogged: boolean;
    isLoaded: boolean;
}

export const AdminAuthModule: Module<AdminAuthState, any> = {
    namespaced: true,
    state: {
        isLoaded: false,
        isLogged: false,
    },
    getters: {
        isLoaded: (state) => state.isLoaded,
        isLogged: (state) => state.isLogged,
        user: (state) => state.user,
        role: (state) => state.user?.role,
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
        },
        setLoaded(state, isLoaded = false) {
            state.isLoaded = isLoaded;
        },
        setLogged(state, isLogged = false) {
            state.isLogged = isLogged;
        },
    },
    actions: {
        async fetchProfile({ commit }) {
            commit("setLoaded");
            try {
                const { data } = await axiosInstance.get("/admin/profile");
                commit("setUser", data);
                commit("setLogged", true);
            } finally {
                commit("setLoaded", true);
            }
        },
        async login({ dispatch }, payload: LoginRequest) {
            const { data } = await axiosInstance.post<LoginResponse>(
                "/auth/admin/login",
                {},
                {
                    auth: {
                        username: payload.email,
                        password: payload.password,
                    },
                },
            );
            axiosInstance.defaults.headers.Authorization = `Bearer ${data.accessToken}`;
            localStorage.setItem("access_token", data.accessToken);
            localStorage.setItem("refresh_token", data.refreshToken);
            dispatch("fetchProfile");
        },
        async logout() {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            window.location.reload();
        },
    },
};
