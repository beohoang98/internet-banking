<template>
    <el-container style="height: 100%;">
        <el-aside>
            <app-sidebar />
        </el-aside>
        <el-main>
            <router-view />
        </el-main>
    </el-container>
</template>

<script lang="ts">
    import Vue from "vue";
    import AppSidebar from "@/components/Sidebar/Sidebar.vue";
    import { Aside, Container, Main } from "element-ui";

    Vue.component(Container.name, Container);
    Vue.component(Aside.name, Aside);
    Vue.component(Main.name, Main);

    export default {
        components: { AppSidebar },
    };
</script>
