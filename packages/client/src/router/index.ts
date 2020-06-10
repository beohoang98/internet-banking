import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import Auth from "@/views/Auth.vue";
import AppLoad from "@/container/AppLoad.vue";
import { Component } from "vue-property-decorator";
import AppStore from '@/store';

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
                component: Auth,
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
                name: "Home",
                component: Home,
                meta: {
                    auth: true,
                },
            },
        ],
    },
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes,
});

router.beforeEach((to, from, next) => {
    console.debug("Route ", to);
    if (to.matched.some((record) => !!record.meta.auth)) {
        if (AppStore.getters["auth/isLogged"]) {
            return next();
        } else {
            return next({ name: "login" });
        }
    }
    next();
});

export default router;
