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
        <el-tabs tab-position="top">
            <el-tab-pane label="Info">
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
            <el-tab-pane label="Transactions">
                <el-row>
                    <el-col>
                        <el-card>
                            <template #header>
                                <h2>Total transaction</h2>
                            </template>
                            <p>{{ stat.transCount }}</p>
                        </el-card>
                    </el-col>
                    <el-col>
                        <el-card>
                            <template #header>
                                <h2>Total amount</h2>
                            </template>
                            <p>{{ stat.transSum | vndFormat }}</p>
                        </el-card>
                    </el-col>
                </el-row>
                <el-divider />
                <el-table :data="transactions"></el-table>
            </el-tab-pane>
        </el-tabs>
    </el-dialog>
</template>

<script lang="ts">
import { Component, Ref, Vue } from "vue-property-decorator";
import { Form } from "element-ui";
import { axiosInstance } from "@/utils/axios";

@Component({
    name: "partner-detail-modal",
})
export default class PartnerDetailModal extends Vue {
    @Ref("form") form!: Form;

    localVisible = false;
    isLoading = false;
    isLoaded = false;

    transactions: Transaction[] = [];

    info = {
        publicKey: "",
        newPassword: "",
    };
    editInfoRules = {
        publicKey: [{ type: "string", required: false }],
        newPassword: [{ type: "string", min: 6, required: false }],
    };
    stat = {
        transCount: 0,
        transSum: 0,
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
            .get<Paginate<PartnerTransLog>>(
                `/admin/partner/${this.partnerId}/transactions`,
            )
            .then(({ data }) => {
                this.transactions = data.items.map((item) => item.transaction);
            });

        axiosInstance
            .get(`/admin/partner/${this.partnerId}/transaction-total`)
            .then(({ data }) => {
                console.debug(data);
                this.stat = data[0];
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

    mounted() {
        this.localVisible = true;
        this.fetchInfo();
        this.fetchTransaction();
    }
}
</script>

<style lang="scss"></style>
