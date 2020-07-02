<template>
    <div class="debt-home">
        <el-button
            round
            icon="el-icon-circle-plus"
            type="primary"
            @click="openAddDebt()"
            >New Debt</el-button
        >
        <hr />
        <el-table border fit show-header :data="data">
            <el-table-column type="index" label="#" />
            <el-table-column prop="account" label="Account Number" />
            <el-table-column prop="name" label="Name" />
            <el-table-column prop="amount" label="Amount" />
            <el-table-column prop="note" label="Note" />
            <el-table-column prop="isMyDebt" label="Is My Debt">
                <template slot-scope="scope">
                    <el-tag
                        :type="
                            scope.row.isMyDebt === true ? 'success' : 'danger'
                        "
                        disable-transitions
                        >{{ scope.row.isMyDebt }}</el-tag
                    >
                </template>
            </el-table-column>
            <el-table-column
                fixed="right"
                width="auto"
                label="Actions"
                align="right"
            >
                <template slot-scope="{ row }">
                    <el-button
                        v-if="row.isMyDebt === true"
                        type="success"
                        @click="() => handleSend(row)"
                        >Paid</el-button
                    >

                    <el-button
                        size="small"
                        type="primary"
                        circle
                        icon="el-icon-edit"
                    ></el-button>

                    <el-button
                        slot="reference"
                        circle
                        size="small"
                        type="danger"
                        icon="el-icon-delete"
                        @click="showDelete(row)"
                    ></el-button>
                </template>
            </el-table-column>
        </el-table>
        <AddDebt :visible="addDebtVisible" v-on:close-dialog="closeAddDebt()" />
        <el-dialog
            title="Delete Debt"
            :visible.sync="deleteDebtVisible"
            @close="handleClose()"
        >
            <h1>Are you sure to delete this</h1>
            <el-form :model="form" ref="form">
                <el-form-item label="Note" :label-width="labelWidth">
                    <el-input v-model="form.note" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose()">Close</el-button>
                <el-button type="primary" @click="deleteDebt()"
                    >Submit</el-button
                >
            </span>
        </el-dialog>
        <el-dialog
            title="Paid Debt"
            :visible.sync="paidDebtVisible"
            @close="handleClose()"
        >
            <el-form :model="form" ref="form">
                <el-form-item label="OTP" :label-width="labelWidth">
                    <el-input v-model="form.otp" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="Note" :label-width="labelWidth">
                    <el-input v-model="form.note" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose()">Close</el-button>
                <el-button type="primary" @click="paidDebt()">Submit</el-button>
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
    Table,
    TableColumn,
    Icon,
    Popconfirm,
    Dialog,
    Form,
    FormItem,
    Input,
    InputNumber,
    Select,
    Option,
    Message,
    Tag,
} from "element-ui";
import { Getter } from "vuex-class";
import AddDebt from "@/components/Debt/AddDebt.vue";
import { axiosInstance } from "../../utils/axios";
Vue.component(Container.name, Container);
Vue.component(Table.name, Table);
Vue.component(TableColumn.name, TableColumn);
Vue.component(Button.name, Button);
Vue.component(Popconfirm.name, Popconfirm);
Vue.component(Icon.name, Icon);
Vue.component(Dialog.name, Dialog);
Vue.component(Form.name, Form);
Vue.component(FormItem.name, FormItem);
Vue.component(Input.name, Input);
Vue.component(Select.name, Select);
Vue.component(Option.name, Option);
Vue.component(InputNumber.name, InputNumber);
Vue.component(Message.name, Message);
Vue.component(Popconfirm.name, Popconfirm);
Vue.component(Tag.name, Tag);

@Component({
    name: "debt-home",
    components: {
        AddDebt,
    },
})
export default class DebtHome extends Vue {
    addDebtVisible = false;
    deleteDebtVisible = false;
    paidDebtVisible = false;
    form = {
        note: "",
        otp: "",
    };
    rowId = -1;
    accountNumber = "";
    amount = "";

    handleClose() {
        this.deleteDebtVisible = false;
        this.form.note = "";
        this.form.otp = "";
    }

    @Getter("debt/data") data!: any;

    handleSend(row: any) {
        this.accountNumber = row.account;
        this.amount = row.amount;
        this.paidDebtVisible = true;
        this.rowId = row.id;
        this.sendOtp();
    }

    showDelete(row: any) {
        this.deleteDebtVisible = true;
        this.rowId = row.id;
    }

    openAddDebt() {
        this.addDebtVisible = true;
    }
    mounted(): void {
        this.$store.dispatch("debt/loadDebtList");
    }

    async sendOtp() {
        try {
            const { data: data } = await axiosInstance.get("/otp");
            Message({
                showClose: true,
                message: "An email otp has been sent to you",
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

    async paidDebt() {
        try {
            const { data: data } = await axiosInstance.post("/transaction", {
                desAccount: this.accountNumber,
                amount: Number(this.amount),
                note: this.form.note,
                otp: Number(this.form.otp),
                isDebtPay: true,
                bankType: "LOCAL",
                isCharge: true,
            });

            await this.$store.dispatch("debt/deleteDebt", {
                id: this.rowId,
                note: this.form.note,
            });
            Message({
                showClose: true,
                message: "Create transaction successful",
                type: "success",
            });
            this.accountNumber = "";
            this.amount = "";
            this.rowId = -1;
            this.paidDebtVisible = false;
        } catch (e) {
            Message({
                showClose: true,
                message: e,
                type: "error",
            });
        }
    }

    async deleteDebt() {
        try {
            await this.$store.dispatch("debt/deleteDebt", {
                id: this.rowId,
                note: this.form.note,
            });
            Message({
                showClose: true,
                message: "Delete debt successful",
                type: "success",
            });
            this.rowId = -1;
            this.form.note = "";
            this.deleteDebtVisible = false;
        } catch (e) {
            Message({
                showClose: true,
                message: e,
                type: "error",
            });
        }
    }

    closeAddDebt() {
        this.addDebtVisible = false;
    }
}
</script>
