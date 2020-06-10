import { Module } from "vuex";
import { LoginPayload, LoginResponse } from "@/store/auth/actions";
import { axiosInstance } from "@/utils/axios";

export interface AuthState {
    profile?: any;
    isLogged: boolean;
    isLoaded: boolean;
}

export const AuthModule: Module<AuthState, any> = {
    namespaced: true,
    state() {
        return {
            profile: undefined,
            isLogged: false,
            isLoaded: false,
        };
    },
    getters: {
        profile: (state: AuthState): any => state.profile,
        isLogged: (state: AuthState): boolean => state.isLogged,
        isLoaded: (state) => state.isLoaded,
    },
    mutations: {
        setProfile(state, profile) {
            state.profile = profile;
        },
        setLogged: (state, logged = true) => (state.isLogged = logged),
        setLoaded: (state, loaded = true) => (state.isLoaded = loaded),
    },
    actions: {
        async login({ commit, dispatch }, payload: LoginPayload) {
            const { data } = await axiosInstance.post<LoginResponse>(
                "/auth/login",
                {},
                {
                    auth: {
                        username: payload.email,
                        password: payload.password,
                    },
                },
            );
            localStorage.setItem(`access_token`, data.accessToken);
            localStorage.setItem(`refresh_token`, data.refreshToken);
            axiosInstance.defaults.headers.Authorization = `Bearer ${data.accessToken}`;
            commit("setLogged", true);
            dispatch("loadProfile");
        },
        async loadProfile({ commit }) {
            try {
                const { data: profile } = await axiosInstance.get(
                    "/user/profile",
                );
                commit("setProfile", profile);
                commit("setLogged", true);
            } finally {
                commit("setLoaded", true);
            }
        },
    },
};
