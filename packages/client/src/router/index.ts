import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import AppLoad from "@/container/AppLoad.vue";
import { Component } from "vue-property-decorator";
import AppStore from "@/store";
import NotFound from "../views/NotFound.vue";

Vue.use(VueRouter);
Component.registerHooks(["beforeRouteUpdate"]);

const routes: Array<RouteConfig> = [
    {
        name: "AppLoader",
        path: "/",
        component: AppLoad,
        children: [
            {
                path: "/auth",
                component: () => import("@/views/Auth.vue"),
                children: [
                    {
                        path: "",
                        redirect: "login",
                    },
                    {
                        name: "login",
                        path: "login",
                        component: () => import("@/components/Auth/Login.vue"),
                        meta: {
                            title: "Login",
                        },
                    },
                    {
                        name: "register",
                        path: "register",
                        component: () => import("@/components/Auth/Login.vue"),
                        meta: {
                            title: "Register",
                        },
                    },
                ],
            },
            {
                path: "/",
                name: "AppLayout",
                component: () => import("@/container/AppLayout.vue"),
                meta: {
                    auth: true,
                },
                children: [
                    {
                        path: "",
                        redirect: "home",
                    },
                    {
                        path: "/home",
                        name: "Home",
                        component: () => import("@/views/Home.vue"),
                    },
                    {
                        path: "receivers",
                        name: "Receivers",
                        component: () => import("@/views/Receivers.vue"),
                    },
                    {
                        path: "change-password",
                        name: "ChangePassword",
                        component: () => import("@/views/ChangePassword.vue"),
                    },
                    {
                        path: "reset-password",
                        name: "ResetPassword",
                        component: () => import("@/views/ResetPassword.vue"),
                    },
                    {
                        path: "debt",
                        name: "Debt",
                        component: () => import("@/views/Debt.vue"),
                    },
                    {
                        path: "history",
                        name: "History",
                        component: () => import("@/views/History.vue"),
                    },
                    {
                        path: "*",
                        component: NotFound,
                    },
                ],
            },
        ],
    },
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL + "/app",
    routes,
});

router.beforeEach((to, from, next) => {
    console.debug("Route ", to);
    if (to.matched.some((record) => !!record.meta.auth)) {
        if (
            AppStore.getters["auth/isLogged"] ||
            !AppStore.getters["auth/isLoaded"]
        ) {
            return next();
        } else {
            return next({ name: "login" });
        }
    }
    next();
});

export default router;
