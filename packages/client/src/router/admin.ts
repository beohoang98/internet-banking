import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import { Component } from "vue-property-decorator";
import AdminLogin from "@/components/Auth/AdminLogin.vue";
import AdminStore from "@/admins/store";
import AdminLoad from "@/container/AdminLoad.vue";
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
                component: () => import("@/admins/pages/Home.vue"),
                children: [
                    {
                        path: "",
                        name: "home",
                        redirect: "users",
                    },
                    {
                        path: "users",
                        name: "user-management",
                        component: () =>
                            import("@/admins/pages/UserManagement.vue"),
                        meta: {
                            role: ["EMPLOYEE", "ADMIN"],
                        },
                    },
                    {
                        path: "employees",
                        name: "employee-management",
                        component: () =>
                            import("@/admins/pages/EmployeeManagement.vue"),
                        meta: {
                            role: ["ADMIN"],
                        },
                    },
                    {
                        path: "partner",
                        name: "partner-management",
                        component: () =>
                            import("@/admins/pages/PartnerManagement.vue"),
                        meta: {
                            role: ["ADMIN"],
                        },
                        children: [
                            {
                                path: ":id",
                                name: "partner-detail",
                                component: () =>
                                    import(
                                        "@/admins/components/Partner/PartnerDetailModal.vue"
                                    ),
                            },
                        ],
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
        if (!AdminStore.getters["auth/isLoaded"]) {
            return next();
        }
        if (!AdminStore.getters["auth/isLogged"]) {
            return next({ name: "login" });
        }
        const role = AdminStore.getters["auth/role"];
        if (
            to.matched.some(
                (record) =>
                    Array.isArray(record.meta.role) &&
                    !record.meta.role.includes(role),
            )
        ) {
            if (role === "ADMIN") {
                return next({ name: "employee-management" });
            }
            return next({ name: "user-management" });
        }
        return next();
    }
    next();
});

export default router;
