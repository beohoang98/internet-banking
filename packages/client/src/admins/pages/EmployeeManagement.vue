<template>
    <div class="employee-management">
        <el-row type="flex" justify="space-between" align="middle">
            <el-input
                style="width: 300px;"
                prefix-icon="el-icon-search"
                placeholder="Search by name"
                v-model="searchName"
                clearable
                @keydown.native.enter="onSearchName"
                :disabled="loading"
            />
            <el-button
                type="primary"
                @click="() => (openAdd = true)"
                icon="el-icon-plus"
                >Add</el-button
            >
        </el-row>
        <el-divider />
        <el-table
            v-loading="loading"
            :lazy="!isEnd"
            :load="onLoadMore"
            max-height="100%"
            border
            :data="employees"
            empty-text="Empty"
        >
            <el-table-column label="ID" prop="id" />
            <el-table-column min-width="200" label="Name" prop="name" />
            <el-table-column min-width="200" label="Email" prop="email" />
            <el-table-column
                label="Created"
                prop="createdAt"
                min-width="200"
                :formatter="formatDate"
            />
            <el-table-column
                label="Updated"
                prop="updatedAt"
                min-width="200"
                :formatter="formatDate"
            />
            <el-table-column
                fixed="right"
                width="100"
                align="center"
                label="Actions"
            >
                <el-button
                    slot-scope="{ row }"
                    @click="() => (chosenEmployee = row)"
                    circle
                    size="small"
                    icon="el-icon-edit"
                    type="info"
                />
            </el-table-column>
        </el-table>

        <admin-employee-add-modal :visible.sync="openAdd" />
        <admin-employee-update-modal
            :employee="chosenEmployee"
            @close="() => (chosenEmployee = null)"
        />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { axiosInstance } from "@/utils/axios";
import AdminEmployeeAddModal from "@/admins/components/Employee/EmployeeAddModal.vue";
import AdminEmployeeUpdateModal from "@/admins/components/Employee/EmployeeUpdateModal.vue";

@Component({
    name: "employee-management",
    components: { AdminEmployeeUpdateModal, AdminEmployeeAddModal },
})
export default class EmployeeManagement extends Vue {
    employees: Admin[] = [];
    searchName = "";
    page = 1;
    isEnd = false;
    loading = false;

    openAdd = false;

    chosenEmployee: Admin | null = null;

    onSearchName() {
        this.page = 1;
        this.fetch();
    }

    onLoadMore() {
        this.page++;
        this.fetch(true);
    }
    onRefresh() {
        this.page = 1;
        this.fetch();
    }

    formatDate(row: Admin, col: string, value: number) {
        return new Date(value).toLocaleString();
    }

    async fetch(isAppend = false) {
        this.loading = true;
        try {
            const { data } = await axiosInstance.get<Paginate<Admin>>(
                "/admin/employee",
                {
                    params: {
                        name: this.searchName,
                        page: this.page || 1,
                    },
                },
            );

            if (isAppend) {
                this.employees = this.employees.concat(data.items);
            } else {
                this.employees = data.items;
            }
            this.page = data.meta.currentPage;
            this.isEnd = !data.links.next;
        } catch (e) {
            this.$notify({
                type: "error",
                message: e?.response?.data?.message || e + "",
                title: "Error",
            });
        }
        this.loading = false;
    }

    mounted() {
        this.fetch();
    }
}
</script>

<style lang="scss"></style>
