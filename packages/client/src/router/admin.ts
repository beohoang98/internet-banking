import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import { Component } from "vue-property-decorator";
import AdminLogin from "@/components/Auth/AdminLogin.vue";
import AdminStore from "@/admins/store";
import AdminLoad from "@/container/AdminLoad.vue";
import { AdminRole } from "@backend/src/models";
import NotFound from "../views/NotFound.vue";

Vue.use(VueRouter);
Component.registerHooks(["beforeRouteUpdate"]);

const routes: Array<RouteConfig> = [
    {
        name: "main",
        component: AdminLoad,
        path: "/",
        meta: {
            auth: true,
        },
        children: [
            {
                path: "",
                name: "home",
                component: () => import("@/admins/pages/Home.vue"),
                children: [
                    {
                        path: "/admin",
                        name: "admin-home",
                        meta: {
                            role: AdminRole.ADMIN,
                        },
                    },
                    {
                        path: "/employee",
                        name: "admin-home",
                        meta: {
                            role: AdminRole.EMPLOYEE,
                        },
                    },
                ],
            },
        ],
    },
    {
        name: "login",
        path: "/login",
        component: AdminLogin,
    },
    {
        name: "not-found",
        path: "/*",
        component: NotFound,
    },
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL + "admin",
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.matched.some((record) => !!record.meta.auth)) {
        if (
            AdminStore.getters["auth/isLogged"] ||
            !AdminStore.getters["auth/isLoaded"]
        ) {
            return next();
        } else {
            return next({ name: "login" });
        }
    }
    next();
});

export default router;
