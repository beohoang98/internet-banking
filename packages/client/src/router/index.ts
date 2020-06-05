import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import Auth from "@/views/Auth.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: "/auth",
        name: "login",
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
    },
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes,
});

export default router;
