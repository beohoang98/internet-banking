<template>
    <div class="Transfer">
        <el-dialog
            title="New transfer"
            :visible.sync="visible"
            @close="handleClose()"
            ref="dialog"
        >
            <div v-if="step === 1">
                <el-form :model="form" ref="form" v-loading="true">
                    <el-form-item label="Bank" :label-width="labelWidth">
                        <el-select
                            v-model="form.bankType"
                            placeholder="Please select a bank type"
                            :disabled="isChoose"
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
                            :disabled="isChoose"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="Name" :label-width="labelWidth">
                        <el-input
                            v-model="form.name"
                            autocomplete="off"
                            :disabled="isChoose"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="Amount" :label-width="labelWidth">
                        <el-input
                            v-model="form.amount"
                            autocomplete="off"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="Note" :label-width="labelWidth">
                        <el-input
                            v-model="form.note"
                            autocomplete="off"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="Charge" :label-width="labelWidth">
                        <el-switch
                            v-model="form.isCharge"
                            active-text="Pay by remitter"
                            inactive-text="Pay by receiver"
                        ></el-switch>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="handleClose()">Cancel</el-button>
                    <el-button type="submit" @click="nextStep()"
                        >Next</el-button
                    >
                </span>
            </div>

            <div v-if="step === 2">
                <el-form :model="form" ref="form">
                    <el-form-item label="OTP" :label-width="labelWidth">
                        <el-input
                            v-model="form.otp"
                            autocomplete="off"
                        ></el-input>
                    </el-form-item>
                </el-form>
                <el-button @click="handleClose()">Cancel</el-button>
                <el-button @click="step = 1">Back</el-button>
                <el-button type="primary" @click="submit()">Submit</el-button>
            </div>

            <div v-if="step === 3">
                <h2>Do you want to create new receiver?</h2>
                <el-form :model="form" ref="form">
                    <el-form-item
                        label="Account Number"
                        :label-width="labelWidth"
                    >
                        <el-input
                            v-model="form.accountNumber"
                            autocomplete="off"
                            disabled="true"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="Name" :label-width="labelWidth">
                        <el-input
                            v-model="form.name"
                            autocomplete="off"
                        ></el-input>
                    </el-form-item>
                </el-form>
                <el-button @click="handleClose()">Close</el-button>
                <el-button type="primary" @click="saveReceiver()"
                    >Submit</el-button
                >
            </div>
        </el-dialog>
    </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
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
    Switch,
} from "element-ui";
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
Vue.component(Switch.name, Switch);
@Component({
    name: "Transfer",
})
export default class Transfer extends Vue {
    @Prop({ default: false, type: Boolean }) visible!: boolean;
    @Prop({ default: "", type: String }) accountNumber!: string;
    @Prop({ default: "", type: String }) bankType!: string;
    @Prop({ default: "", type: String }) name!: string;
    @Prop({ default: false, type: Boolean }) isChoose!: boolean;

    @Watch("accountNumber", { immediate: true })
    changeAccountNumber() {
        this.form.accountNumber = this.accountNumber;
    }

    @Watch("name", { immediate: true })
    changeName() {
        this.form.name = this.name;
    }

    @Watch("bankType", { immediate: true })
    changeBankType() {
        this.form.bankType = this.bankType;
    }

    step = 1;
    disableUpdateInput = false;
    labelWidth = "120px";
    form = {
        bankType: this.bankType,
        accountNumber: this.accountNumber,
        name: this.name,
        amount: "",
        note: "",
        otp: "",
        isCharge: true,
    };
    handleClose() {
        this.visible = false;
        this.resetForm();
        this.$emit("close-dialog");
    }

    resetForm() {
        this.step = 1;
        this.bankType = "";
        this.accountNumber = "";
        this.name = "";
        this.form.amount = "";
        this.form.note = "";
        this.form.otp = "";
        this.form.isCharge = true;
    }

    async getName() {
        try {
            if (this.form.bankType === "LOCAL") {
                const { data: data } = await axiosInstance.get(
                    "user/profile/accountnumber?number=" +
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
        }
    }

    async nextStep() {
        try {
            const { data: data } = await axiosInstance.get("/otp");
            Message({
                showClose: true,
                message: "An email otp has been sent to you",
                type: "success",
            });
            this.step = 2;
        } catch (e) {
            Message({
                showClose: true,
                message: e,
                type: "error",
            });
        }
    }
    async submit() {
        try {
            if (this.form.bankType === "LOCAL") {
                const { data: data } = await axiosInstance.post(
                    "/transaction",
                    {
                        desAccount: this.form.accountNumber,
                        amount: Number(this.form.amount),
                        note: this.form.note,
                        otp: Number(this.form.otp),
                        isDebtPay: false,
                        bankType: this.form.bankType,
                        isCharge: this.form.isCharge,
                    },
                );
                Message({
                    showClose: true,
                    message: "Create transaction successful",
                    type: "success",
                });
            }

            if (this.form.bankType === "RSA" || this.form.bankType === "PGP") {
                const { data: data } = await axiosInstance.post(
                    "/transaction/interbank",
                    {
                        accountNumber: this.form.accountNumber,
                        amount: Number(this.form.amount),
                        note: this.form.note,
                        otp: Number(this.form.otp),
                        isDebtPay: false,
                        bankType: this.form.bankType,
                        isCharge: this.form.isCharge,
                    },
                );
                Message({
                    showClose: true,
                    message: "Create transaction successful",
                    type: "success",
                });
            }
            this.step = 3;
            //this.handleClose();
        } catch (e) {
            Message({
                showClose: true,
                message: e,
                type: "error",
            });
        }
    }

    async saveReceiver() {
        try {
            await this.$store.dispatch("receiver/addReceiver", {
                desAccountNumber: this.form.accountNumber,
                name: this.form.name,
                bankType: this.form.bankType,
            });
            this.handleClose();

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
        }
    }
}
</script>
