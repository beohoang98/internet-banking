<template>
    <div class="partner-management">
        <el-table v-loading="isLoading" stripe border fit :data="partners">
            <el-table-column label="id" prop="id" />
            <el-table-column label="type" prop="type" />
            <el-table-column label="actions" align="right">
                <template slot-scope="{ row }">
                    <el-button type="link" @click="() => showDetail(row)"
                        >Details</el-button
                    >
                </template>
            </el-table-column>
        </el-table>
        <router-view />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { axiosInstance } from "@/utils/axios";

@Component({
    name: "admin-partner-management",
})
export default class AdminPartnerManagement extends Vue {
    partners: Partner[] = [];
    isLoading = false;

    async fetch() {
        this.isLoading = true;
        try {
            const { data } = await axiosInstance.get<Partner[]>(
                "/admin/partner",
            );
            this.partners = data;
        } catch (e) {
            this.$notify({
                type: "error",
                title: "Error",
                message: e?.response?.data?.message || e + "",
            });
        } finally {
            this.isLoading = false;
        }
    }

    showDetail(row: Partner) {
        this.$router.push({
            name: "partner-detail",
            params: {
                id: row.id,
            },
        });
    }

    mounted() {
        this.fetch();
    }
}
</script>

<style lang="scss"></style>
