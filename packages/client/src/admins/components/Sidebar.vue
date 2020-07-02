<template>
    <el-aside width="300" class="admin-sidebar">
        <el-menu
            style="height: 100%;"
            router
            :default-active="$route.path"
            background-color="transparent"
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

        <el-dropdown
            trigger="click"
            @command="handleLogout"
            style="align-self: center;"
        >
            <el-button icon="el-icon-s-tools" circle type="info" size="large" />
            <el-dropdown-menu>
                <el-dropdown-item icon="el-icon-back" command="logout"
                    >Logout</el-dropdown-item
                >
            </el-dropdown-menu>
        </el-dropdown>
    </el-aside>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
    name: "admin-sidebar",
})
export default class AdminSidebar extends Vue {
    handleLogout(command: string) {
        if (command === "logout") this.$store.dispatch("auth/logout");
    }
}
</script>

<style lang="scss">
.admin-sidebar {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: #333;
    padding: 1em 0;
}
</style>
