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

Vue.use(Container);
Vue.use(Aside);
Vue.use(Main);

export default Vue.extend({
    components: { AppSidebar },
});
</script>
