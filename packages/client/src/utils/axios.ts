import Axios, { AxiosError } from "axios";
import { LoginResponse } from "@/store/auth/actions";

const getAccessToken = () => localStorage.getItem("access_token");
const getRefreshToken = () => localStorage.getItem("refresh_token");

export const axiosInstance = Axios.create({
    baseURL: process.env.VUE_APP_API_URL || "/api",
    headers: {
        Authorization: getAccessToken()
            ? `Bearer ${getAccessToken()}`
            : undefined,
    },
    withCredentials: false,
});

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error: AxiosError) => {
        const lastReq = error.config;
        const status = error?.response?.status;
        if (
            (status === 403 || status === 401) &&
            !lastReq._retry &&
            getAccessToken() &&
            getRefreshToken()
        ) {
            lastReq._retry = true;
            return axiosInstance
                .post<LoginResponse>("auth/refresh", {
                    accessToken: getAccessToken(),
                    refreshToken: getRefreshToken(),
                }, {
                    _retry: true,
                })
                .then((res) => {
                    localStorage.setItem("access_token", res.data.accessToken);
                    axiosInstance.defaults.headers.Authorization = `Bearer ${res.data.accessToken}`;
                    return Axios(lastReq);
                });
        }

        return Promise.reject(error);
    },
);
