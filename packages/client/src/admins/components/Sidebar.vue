<template>
    <el-aside width="300">
        <el-menu
            style="height: 100%;"
            router
            :default-active="$route.path"
            background-color="#333"
            text-color="#ccc"
            active-text-color="#f80"
        >
            <el-menu-item v-role="['ADMIN', 'EMPLOYEE']" index="/users">
                <el-icon name="user" />
                User Management
            </el-menu-item>
            <el-menu-item v-role="['ADMIN']" index="/employees">
                <el-icon name="user-solid" />
                Employee Management
            </el-menu-item>
            <el-menu-item v-role="['ADMIN']" index="/partner">
                <el-icon name="connection" />
                Partner Management
            </el-menu-item>
        </el-menu>
    </el-aside>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
    name: "admin-sidebar",
})
export default class AdminSidebar extends Vue {}
</script>
