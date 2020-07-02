<template>
    <el-container direction="horizontal" style="height: 100%;">
        <admin-sidebar />
        <el-main>
            <router-view></router-view>
        </el-main>
    </el-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AdminSidebar from "@/admins/components/Sidebar.vue";

@Component({
    name: "admin-home",
    components: { AdminSidebar },
})
export default class AdminHome extends Vue {}
</script>
