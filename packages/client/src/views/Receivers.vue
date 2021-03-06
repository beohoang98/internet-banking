<template>
    <div class="app-receivers">
        <Transfer
            :accountNumber="addTransAccountNumber"
            :name="addTransName"
            :bankType="addTransBankType"
            :isChoose="isChoose"
            :visible="dialogTransferVisible"
            v-on:close-dialog="closeTransfer()"
        />

        <AddDebt
            :visible="dialogDebtVisible"
            v-on:close-dialog="closeAddDebt()"
            :accountNumber="addDebtAccountNumber"
            :name="addDebtName"
            :isChoose="isChoose"
        />
        <el-button
            round
            icon="el-icon-circle-plus"
            type="primary"
            @click="dialogTransferVisible = true"
            >New Transfer</el-button
        >
        <el-button
            round
            icon="el-icon-circle-plus"
            type="primary"
            @click="dialogFormVisible = true"
            >New Receiver</el-button
        >
        <hr />
        <el-table border fit show-header :data="data">
            <el-table-column type="index" label="#" />
            <el-table-column prop="name" label="Name" />
            <el-table-column prop="desAccountNumber" label="Account Number" />
            <el-table-column prop="bankType" label="Bank" />
            <el-table-column
                fixed="right"
                width="auto"
                label="Actions"
                align="right"
            >
                <template slot-scope="{ row }">
                    <el-button type="success" @click="() => handleSend(row)"
                        >Send Money</el-button
                    >
                    <el-button
                        type="warning"
                        v-if="row.bankType === 'LOCAL'"
                        @click="() => handleCreateDebt(row)"
                        >Create Debt</el-button
                    >
                    <el-button
                        size="small"
                        type="primary"
                        circle
                        icon="el-icon-edit"
                        @click="() => handleEdit(row)"
                    ></el-button>
                    <el-popconfirm
                        title="Are you sure to delete this?"
                        @onConfirm="() => handleDelete(row)"
                    >
                        <el-button
                            slot="reference"
                            circle
                            size="small"
                            type="danger"
                            icon="el-icon-delete"
                        ></el-button>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog
            :title="titleDialog"
            :visible.sync="dialogFormVisible"
            @close="closeForm()"
        >
            <el-form :model="form" ref="form" v-loading="isLoading">
                <el-form-item label="Bank" :label-width="labelWidth">
                    <el-select
                        v-model="form.bankType"
                        placeholder="Please select a bank type"
                        :disabled="disableUpdateInput"
                    >
                        <el-option label="LOCAL" value="LOCAL"></el-option>
                        <el-option label="PGP" value="PGP"></el-option>
                        <el-option label="RSA" value="RSA"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="Account number"
                    :label-width="labelWidth"
                    v-on:change.native="getName()"
                >
                    <el-input
                        v-model="form.accountNumber"
                        autocomplete="off"
                        :disabled="disableUpdateInput"
                    ></el-input>
                </el-form-item>
                <el-form-item label="Name" :label-width="labelWidth">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeForm()">Cancel</el-button>
                <el-button type="submit" @click="submitForm()"
                    >Confirm</el-button
                >
            </span>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import {
    Button,
    Container,
    Dialog,
    Form,
    FormItem,
    Icon,
    Input,
    InputNumber,
    Message,
    Option,
    Popconfirm,
    Select,
    Table,
    TableColumn,
} from "element-ui";
import { Getter } from "vuex-class";
import Transfer from "@/components/Transfer/Transfer.vue";
import AddDebt from "@/components/Debt/AddDebt.vue";
import { axiosInstance } from "@/utils/axios";

Vue.use(Container);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Button);
Vue.use(Popconfirm);
Vue.use(Icon);
Vue.use(Dialog);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Select);
Vue.use(Option);
Vue.use(InputNumber);
Vue.use(Popconfirm);

@Component({
    name: "app-receivers",
    components: {
        Transfer,
        AddDebt,
    },
})
export default class ReceiversPage extends Vue {
    dialogFormVisible = false;
    accountNumber = "";
    name = "";
    bankType = "";
    labelWidth = "150px";
    disableUpdateInput = false;
    titleDialog = "ADD NEW RECEIVER";
    index = -1;
    id = -1;
    dialogTransferVisible = false;

    addTransAccountNumber = "";
    addTransName = "";
    addTransBankType = "";
    isChoose = false;

    isLoading = false;

    dialogDebtVisible = false;
    addDebtAccountNumber = "";
    addDebtName = "";

    form = {
        name: "",
        bankType: "",
        accountNumber: "",
    };
    @Getter("receiver/data") data!: any;

    closeTransfer() {
        this.dialogTransferVisible = false;
        this.addTransAccountNumber = "";
        this.addTransName = "";
        this.addTransBankType = "";
        this.isChoose = false;
    }

    closeAddDebt() {
        this.dialogDebtVisible = false;
        this.addDebtAccountNumber = "";
        this.addTransName = "";
        this.isChoose = false;
    }

    closeForm() {
        this.titleDialog = "ADD NEW RECEIVER";
        this.dialogFormVisible = false;
        this.form.name = "";
        this.form.accountNumber = "";
        this.form.bankType = "";
        this.disableUpdateInput = false;
        this.isLoading = false;
    }

    handleCreateDebt(row: any) {
        this.addDebtAccountNumber = row.desAccountNumber;
        this.addDebtName = row.name;
        this.isChoose = true;
        this.dialogDebtVisible = true;
    }

    async handleSend(row: any) {
        this.addTransAccountNumber = row.desAccountNumber;
        this.addTransName = row.name;
        this.addTransBankType = row.bankType;
        this.isChoose = true;
        this.dialogTransferVisible = true;
    }

    async handleEdit(row: any) {
        this.titleDialog = "UPDATE RECEIVER";
        this.disableUpdateInput = true;
        this.dialogFormVisible = true;
        this.form.name = row.name;
        this.form.accountNumber = row.desAccountNumber;
        this.form.bankType = row.bankType;
        this.index = this.data.indexOf(row);
        this.id = row.id;
    }

    async getName() {
        try {
            this.isLoading = true;
            if (this.form.bankType === "LOCAL") {
                const { data: data } = await axiosInstance.get(
                    "user/profile/account-number?number=" +
                        this.form.accountNumber,
                );
                if (!data) {
                    Message({
                        showClose: true,
                        message: "Cant find account number",
                        type: "error",
                    });
                }
                this.form.name = data.name;
            }
            if (this.form.bankType === "PGP") {
                const { data: data } = await axiosInstance.get(
                    "transaction/interbank/info",
                    {
                        params: {
                            accountNumber: this.form.accountNumber,
                            bankType: "PGP",
                        },
                    },
                );
                if (data.success === false) {
                    Message({
                        showClose: true,
                        message: data.message,
                        type: "error",
                    });
                }
                this.form.name = data.data;
            }

            if (this.form.bankType === "RSA") {
                const { data: data } = await axiosInstance.get(
                    "transaction/interbank/info",
                    {
                        params: {
                            accountNumber: this.form.accountNumber,
                            bankType: "RSA",
                        },
                    },
                );
                if (data.success === false) {
                    Message({
                        showClose: true,
                        message: data.message,
                        type: "error",
                    });
                }
                this.form.name = data.payload.userName;
            }
        } catch (e) {
            Message({
                showClose: true,
                message: e,
                type: "error",
            });
        } finally {
            this.isLoading = false;
        }
    }
    async handleDelete(row: any) {
        try {
            await this.$store.dispatch("receiver/deleteReceiver", {
                id: row.id,
                index: this.data.indexOf(row),
            });
            Message({
                showClose: true,
                message: "Delete receiver successful",
                type: "success",
            });
        } catch (e) {
            Message({
                showClose: true,
                message: e,
                type: "error",
            });
        }
    }

    async submitForm() {
        if (!this.disableUpdateInput) {
            try {
                this.isLoading = true;
                await this.$store.dispatch("receiver/addReceiver", {
                    desAccountNumber: this.form.accountNumber,
                    name: this.form.name,
                    bankType: this.form.bankType,
                });
                this.closeForm();
                Message({
                    showClose: true,
                    message: "Add new receiver successful",
                    type: "success",
                });
            } catch (e) {
                console.log(e);
                Message({
                    showClose: true,
                    message: e,
                    type: "error",
                });
            } finally {
                this.isLoading = false;
            }
        } else {
            try {
                this.isLoading = true;
                await this.$store.dispatch("receiver/updateReceiver", {
                    id: this.id,
                    desAccountNumber: this.form.accountNumber,
                    name: this.form.name,
                    bankType: this.form.bankType,
                    index: this.index,
                });
                Message({
                    showClose: true,
                    message: "Update receiver successful",
                    type: "success",
                });
                this.closeForm();
            } catch (e) {
                console.log({ error: e });
                Message({
                    showClose: true,
                    message: e,
                    type: "error",
                });
            } finally {
                this.isLoading = false;
            }
        }
    }

    mounted() {
        this.$store.dispatch("receiver/loadReceiverList");
    }
}
</script>
