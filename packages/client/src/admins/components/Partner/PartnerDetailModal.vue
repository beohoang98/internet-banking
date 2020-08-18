<template>
    <el-dialog
        close-on-press-escape
        :close-on-click-modal="false"
        :visible="localVisible"
        @close="handleOnClose"
        @closed="handleClosed"
        fullscreen
        modal-fade
        v-loading="isLoading || !isLoaded"
    >
        <template #title>
            <el-page-header
                title="Back"
                content="Details"
                @back="handleOnClose"
            />
        </template>
        <el-tabs tab-position="top" value="trans">
            <el-tab-pane label="Info" name="info">
                <el-form
                    ref="form"
                    label-position="left"
                    :model="info"
                    :rules="editInfoRules"
                >
                    <el-form-item label="Public Key" prop="publicKey">
                        <el-input
                            readonly
                            type="password"
                            show-password
                            v-model="info.publicKey"
                        />
                    </el-form-item>
                    <el-collapse>
                        <el-collapse-item title="More">
                            <el-form-item
                                label="New Password"
                                prop="newPassword"
                            >
                                <el-input
                                    readonly
                                    show-password
                                    type="password"
                                    v-model="info.newPassword"
                                />
                            </el-form-item>
                        </el-collapse-item>
                    </el-collapse>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="Transactions" name="trans">
                <el-row>
                    <el-col>
                        <el-card>
                            <template #header>
                                <h2>Total transaction</h2>
                            </template>
                            <p>{{ stat.trans_count }}</p>
                        </el-card>
                    </el-col>
                    <el-col>
                        <el-card>
                            <template #header>
                                <h2>Total amount</h2>
                            </template>
                            <p>{{ stat.trans_sum | vndFormat }}</p>
                        </el-card>
                    </el-col>
                </el-row>
                <el-divider />
                <!--                <el-table :data="transactions">-->
                <!--                    <el-table-column prop="id" label="ID" />-->
                <!--                    <el-table-column prop="createdAt" label="Created At">-->
                <!--                        <template :slot-scope="{ row: { createdAt } }">-->
                <!--                            {{ createdAt | datetime }}-->
                <!--                        </template>-->
                <!--                    </el-table-column>-->
                <!--                </el-table>-->
                <el-form>
                    <el-form-item label="Filter">
                        <el-date-picker
                            v-model="dateRangeFilter"
                            start-placeholder="Start"
                            end-placeholder="End"
                            format="dd/MM/yyyy"
                            type="daterange"
                            range-separator="To"
                            :clearable="true"
                            editable
                            append-to-body
                        />
                    </el-form-item>
                </el-form>
                <app-paginate-table
                    :queries="transQueries"
                    :api_url="`/admin/partner/${partnerId}/transactions`"
                    :fields="{
                        id: `ID`,
                        createdAt: `Created At`,
                        'transaction.amount': `Amount`,
                    }"
                    :formatter="formatter"
                />
            </el-tab-pane>
        </el-tabs>
    </el-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Ref } from "vue-property-decorator";
import { Form } from "element-ui";
import { axiosInstance } from "@/utils/axios";
import AppPaginateTable from "@/components/PaginateTable/PaginateTable.vue";

@Component({
    name: "partner-detail-modal",
    components: { AppPaginateTable },
})
export default class PartnerDetailModal extends Vue {
    @Ref("form") form!: Form;

    localVisible = false;
    isLoading = false;
    isLoaded = false;

    transactions: Transaction[] = [];
    dateRangeFilter: Date[] = [];

    info = {
        publicKey: "",
        newPassword: "",
    };
    editInfoRules = {
        publicKey: [{ type: "string", required: false }],
        newPassword: [{ type: "string", min: 6, required: false }],
    };
    stat = {
        trans_count: 0,
        trans_sum: 0,
    };

    handleOnClose() {
        this.form.resetFields();
        this.localVisible = false;
    }
    handleClosed() {
        this.isLoaded = false;
        this.$router.replace({
            name: "partner-management",
        });
    }

    get partnerId() {
        return this.$route.params.id;
    }

    fetchTransaction() {
        axiosInstance
            .get(`/admin/partner/${this.partnerId}/transaction-total`)
            .then(({ data }) => {
                console.debug(data);
                this.stat = data;
            });
    }

    fetchInfo() {
        this.isLoading = true;
        axiosInstance
            .get<Partner>(`/admin/partner/${this.partnerId}`)
            .then(({ data }) => {
                this.info = {
                    publicKey: data.publicKey,
                    newPassword: "",
                };
            })
            .catch((error) => {
                this.$notify({
                    title: "Error",
                    type: "error",
                    message: error + "",
                });
            })
            .finally(() => {
                this.isLoading = false;
                this.isLoaded = true;
            });
    }

    get formatter() {
        return {
            createdAt: (val: PartnerTransLog) =>
                this.globalFilter("datetime")(val.createdAt),
            "transaction.amount": (val: PartnerTransLog) =>
                this.globalFilter("vndFormat")(val.transaction.amount),
        };
    }
    get transQueries() {
        return {
            from: this?.dateRangeFilter?.[0],
            to: this?.dateRangeFilter?.[1],
        };
    }

    globalFilter(name: string) {
        return (Vue as any).options.filters[name] || ((val: any) => val);
    }

    mounted() {
        this.localVisible = true;
        this.fetchInfo();
        this.fetchTransaction();
    }
}
</script>

<style lang="scss"></style>
